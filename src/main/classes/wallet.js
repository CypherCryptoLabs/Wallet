const fs = require("fs");
const {app} = require("electron");
const { formatWithCursor } = require("prettier");
const Crypto = require("./crypto");

class Wallet {
    constructor() {
        this._data = {};
        this.loadWalletData();
        this.crypto;
    }

    loadWalletData() {
        try {
            if(!fs.existsSync(app.getPath("appData") + "/cypher-wallet/"))
                fs.mkdirSync(app.getPath("appData") + "/cypher-wallet/")
            
            if(!fs.existsSync(app.getPath("appData") + "/cypher-wallet/wallet.json")) {
                this.crypto = new Crypto();
                this.data = {balance:0, blockHeight: -1, transactions:[], privateKey: this.crypto.privateKey, blockchainAddress: this.crypto.blockchainAddress, nodeAddress: "127.0.0.1", nodePort: 1234};
            } else {
                this._data = JSON.parse(fs.readFileSync(app.getPath("appData") + "/cypher-wallet/wallet.json").toString("utf8"));
                console.log(this._data)
                this.crypto = new Crypto(this._data.privateKey);
            }
        } catch (error) {
            console.log(error)
        }
    }

    get transactionHistory() {
        return this.data.transactions;
    }

    get data() {
        return this._data
    }

    set data(data) {
        this._data = data;

        try {
            fs.writeFileSync(app.getPath("appData") + "/cypher-wallet/wallet.json", JSON.stringify(this._data));
        } catch (error) {
            console.log(error)
        }
    }

    syncToNetwork() {

    }

}

module.exports = Wallet;