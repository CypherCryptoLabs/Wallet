const ellipticcurve = require("@starkbank/ecdsa-node");
const PrivateKey = ellipticcurve.PrivateKey;
const PublicKey = ellipticcurve.PublicKey;

const crypto = require("crypto")

class Crypto {
    constructor(key = undefined) {
        this._privateKey = (key == undefined) ? this.generateKey() : PrivateKey.fromPem(key);
        this._publicKey = this._privateKey.publicKey();
        this.blockchainAddress = crypto.createHash('sha256').update(Buffer.from(this._publicKey.toPem().toString().replace("-----BEGIN PUBLIC KEY-----\n", "").replace("\n", "").replace("-----END PUBLIC KEY-----", ""), "base64")).digest('hex');
        
        console.log(this.privateKey + "\n" + this.publicKey + "\n" + this.blockchainAddress)
    }

    get publicKey() {
        return this._publicKey.toPem()
    }

    get privateKey() {
        return this._privateKey.toPem()
    }

    generateKey() {
        return new PrivateKey();;
    }
}

module.exports = Crypto;