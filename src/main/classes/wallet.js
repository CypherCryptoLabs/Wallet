const fs = require("fs");
const {app} = require("electron");
const { formatWithCursor } = require("prettier");

class Wallet {
    constructor() {
        this._data = {};
        this.loadWalletData();
    }

    loadWalletData() {
        try {
            if(!fs.existsSync(app.getPath("appData") + "/cypher-wallet/wallet.json")) {
                this.data = {balance:0, blockHeight: -1, transactions:[], privateKey: "", blockchainAddress: ""};
            } else {
                this._data = JSON.parse(fs.readFileSync(app.getPath("appData") + "/cypher-wallet/wallet.json").toString("utf8"))
            }
        } catch (error) {
            console.log(error)
        }
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