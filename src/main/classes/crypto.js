const ellipticcurve = require("starkbank-ecdsa");
const PrivateKey = ellipticcurve.PrivateKey;
const Ecdsa = ellipticcurve.Ecdsa;
const PublicKey = ellipticcurve.PublicKey;
const Signature = ellipticcurve.Signature;
const crypto = require('crypto');
const { contextBridge, ipcRenderer } = require('electron')

class bcrypto {

   constructor(privateKeyPath) {
      this.privateKeyPath = privateKeyPath;
      this.privateKey;
      this.publicKey;
      this.fingerprint;
   }

   async generateNewKey() {

      try {
         if (await ipcRenderer.invoke('file-exits', "private.pem")) {
            this.privateKey = PrivateKey.fromPem(await ipcRenderer.invoke('file-read', "private.pem"));
            this.publicKey = this.privateKey.publicKey();

         } else {
            console.log("Key not found")

            this.privateKey = new PrivateKey();
            this.publicKey = this.privateKey.publicKey();

            //fs.writeFileSync('private.pem', this.privateKey.toPem());
            await ipcRenderer.invoke("file-write", "private.pem", this.privateKey.toPem());
         }
         
         this.fingerprint = crypto.createHash('sha256').update(Buffer.from(this.publicKey.toPem().toString().replace("-----BEGIN PUBLIC KEY-----\n", "").replace("\n", "").replace("-----END PUBLIC KEY-----", ""), "base64")).digest('hex');

      } catch (err) {
         console.log(err);
      }
   }

   verrifySignature(signatureBase64, publicKeyPEM, packet) {

      let publicKey = PublicKey.fromPem(publicKeyPEM);
      let signature = Signature.fromBase64(signatureBase64);

      return Ecdsa.verify(packet, signature, publicKey);
   }

   sign(packet) {

      return Ecdsa.sign(packet, this.privateKey).toBase64();

   }

   getPubKey(asPem = false) {
      if (asPem)
         return this.publicKey.toPem();

      return this.publicKey;
   }

   getFingerprint() {
      return this.fingerprint;
   }

   hash(data) {
      return crypto.createHash('sha256').update(data).digest('hex')
   }

}

module.exports = bcrypto;