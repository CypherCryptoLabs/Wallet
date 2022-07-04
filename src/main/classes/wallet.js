const { ipcRenderer } = require("electron");
const fs = require("fs");

class wallet {

    constructor(bcrypto) {
        this.bcrypto = bcrypto;
        this.walletCache = {};
    }

    async loadCache() {
        if(await ipcRenderer.invoke("file-exits", "wallet_cache.json")) {
            this.walletCache = JSON.parse(await ipcRenderer.invoke("file-read", "wallet_cache.json"));
        } else {
            this.walletCache = {units:0, balanceChanges: [], lastBlockHeight:-1};
            await ipcRenderer.invoke("file-write", "wallet-cache.json", JSON.stringify(this.walletCache));
        }
    }

    updateCache(blocks) {

        var cache = this.walletCache;
        
        var localAddress = this.bcrypto.getFingerprint();
        for(var i = 0; i < blocks.length; i++) {
            if(blocks[i].id > cache.lastBlockHeight) {
                console.log(blocks[i].id)
                if(blocks[i].rewardAddress == localAddress) {
                    cache.units += blocks[i].rewardAmount;
                    cache.balanceChanges.push(blocks[i].id);
                }

                for(var j = 0; j < blocks[i].payload.length; j++) {
                    var transaction = blocks[i].payload[j];

                    if(transaction.payload.blockchainSenderAddress == localAddress) {
                        cache.units -= (transaction.payload.unitsToTransfer + transaction.payload.networkFee);
                    }

                    if(transaction.payload.blockchainReceiverAddress == localAddress) {
                        cache.units += transaction.payload.unitsToTransfer;
                    }
                }

                cache.lastBlockHeight = blocks[i].id;
            }
        }

        this.walletCache = cache;
        ipcRenderer.invoke("file-write", "wallet_cache.json", JSON.stringify(this.walletCache))
    }

    getBalance() {

        return this.walletCache.units;

    }

    getLastBlockHeight() {
        if(this.walletCache.lastBlockHeight == -1)
            return 0;

        return this.walletCache.lastBlockHeight;
    }
}

module.exports = wallet;