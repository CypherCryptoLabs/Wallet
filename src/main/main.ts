/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

const Wallet = require('./classes/wallet');
const wallet = new Wallet();
const Networking = require('./classes/networking');
const networking = new Networking(wallet.data.nodeAddress, wallet.data.nodePort, wallet);
console.log(wallet)

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.handle('get-balance', (_event, _) => {
  //return fs.existsSync(app.getPath("appData") + "/cypher-wallet/" + file)
  return wallet.data.balance;
});

ipcMain.handle('get-blockchain-address', (_event, _) => {
  return wallet.data.blockchainAddress;
});

ipcMain.handle('send-transaction', async (_event, data) => {
  return await networking.sendTransaction(data[0], data[1], data[2]);
});

ipcMain.handle("sync-to-network", async (_event, _arg) => {
  await networking.syncBlockchain();
  return;
})

ipcMain.handle("get-transaction-history", async (_event, _arg) => {
  return wallet.transactionHistory;
})

ipcMain.handle("update-settings", async (_event, settingsObj) => {
  networking.nodeAddress = settingsObj.address;
  networking.nodePort = parseInt(settingsObj.port);

  wallet.data.nodeAddress = settingsObj.address;
  wallet.data.nodePort = parseInt(settingsObj.port);

  wallet.data = wallet.data
  return;
})

ipcMain.handle("load-settings", async (_event, _arg) => {
  return {address: wallet.data.nodeAddress, port: wallet.data.nodePort};
})

ipcMain.handle("delete-cache", async (_event, _arg) => {
  wallet.data.balance = 0;
  wallet.data.blockHeight = -1;
  wallet.data.transactions = [];

  wallet.data = wallet.data
})

ipcMain.handle("get-chats", async (_event, _arg) => {
  return wallet.data.chats;
})

ipcMain.handle("create-chat", async (_event, address) => {
  wallet.data.chats[address] = []
  wallet.data = wallet.data
  return;
})

ipcMain.handle("get-messages", async (_event, address) => {
  return wallet.data.chats[address];
})

ipcMain.handle("send-chat", async (_event, args) => {
  networking.sendMessage(args[0], args[1])
  return;
})

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    resizable: false,
    show: false,
    width: 512,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
