const ellipticcurve = require("@starkbank/ecdsa-node");
const PrivateKey = ellipticcurve.PrivateKey;
const PublicKey = ellipticcurve.PublicKey;
const Ecdsa = ellipticcurve.Ecdsa;

const crypto = require("crypto")

class Crypto {
    constructor(key = undefined) {
        this._privateKey = (key == undefined) ? this.generateKey() : PrivateKey.fromPem(key);
        this._publicKey = this._privateKey.publicKey();
        this.blockchainAddress = crypto.createHash('sha256').update(Buffer.from(this._publicKey.toPem().toString().replace("-----BEGIN PUBLIC KEY-----\n", "").replace("\n", "").replace("-----END PUBLIC KEY-----", ""), "base64")).digest('hex');
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

    sign(packet) {
        return Ecdsa.sign(packet, this._privateKey).toBase64();
    }
}

module.exports = Crypto;