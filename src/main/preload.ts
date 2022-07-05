import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    sendMessage(channel: string, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: string, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => ipcRenderer.removeListener(channel, subscription);
    },
    once(channel: string, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    getBalance() {
      return Promise.resolve(ipcRenderer.invoke("get-balance"));
    },
    getBlockchainAddress() {
      return Promise.resolve(ipcRenderer.invoke("get-blockchain-address"));
    },
    sendTransaction(data: (string|number|number)[]) {
      return Promise.resolve(ipcRenderer.invoke("send-transaction", data));
    }
  },
});
