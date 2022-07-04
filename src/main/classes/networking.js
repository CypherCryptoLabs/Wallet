const net = require('net');

class networking {

   constructor(bcrypto, stableNodeAddress, stableNodePort, wallet) {
      this.bcrypto = bcrypto;
      this.stableNodeAddress = stableNodeAddress;
      this.stableNodePort = stableNodePort;
      this.wallet = wallet;
   }

   async syncBlockchain() {

      var packet = {queryID:5, unixTimestamp: Date.now() - 1000, payload:{type: "request", blockHeight:this.wallet.getLastBlockHeight()}, publicKey: this.bcrypto.getPubKey().toPem()};
      var packetCopy = JSON.parse(JSON.stringify(packet));
      delete packetCopy.queryID;
      packet.signature = this.bcrypto.sign(JSON.stringify(packetCopy));

      var newBlocks = "";
      var _this = this;

      var syncPromise = new Promise(function(resolve, reject) {
         var client = new net.Socket();

         client.connect(_this.stableNodePort, _this.stableNodeAddress, () => {
            client.write(JSON.stringify(packet));
            client.end();
         });

         client.on('data', (data) => {

            newBlocks = JSON.parse(data.toString());
            console.log(newBlocks);
            resolve();
         })

         client.on('error', (error) => {
            console.log(error);
            reject();
         })
      })

      try {
         await syncPromise;

         await this.wallet.updateCache(newBlocks.payload.blocks);
      } catch (error) {
         console.log(error);
      }
      
   }

   async sendTransaction(address, amount) {
      var createTransactionPacket = {
         queryID : 1,
         unixTimestamp : Date.now() - 1000,
         payload : {
            blockchainSenderAddress : this.bcrypto.getFingerprint(),
            blockchainReceiverAddress : address,
            unitsToTransfer : amount,
            networkFee : 0.001
         },
         publicKey : this.bcrypto.getPubKey(true),
         signature : ""
      };

      var createTransactionPacketForSignature = JSON.parse(JSON.stringify(createTransactionPacket));
      delete createTransactionPacketForSignature.queryID;
      delete createTransactionPacketForSignature.signature;

      createTransactionPacket.signature = this.bcrypto.sign(JSON.stringify(createTransactionPacketForSignature));
      var _this = this;

      var promise = new Promise(function (resolve, reject) {
         var client = new net.Socket();
         client.connect(_this.stableNodePort, _this.stableNodeAddress, () => {
            client.write(JSON.stringify(createTransactionPacket));

            client.end();
         });

         client.on('data', (data) => {
            console.log(JSON.parse(data.toString()));
            resolve();
         })

         client.on('error', (error) => {
            console.log(error);
            reject();
         })

         client.on('close', () => { 
            console.log('Client closed'); 
        }); 
      });

      try {
         await promise;
      } catch (error) {
         console.log(error)
      }

   }

}

module.exports = networking;