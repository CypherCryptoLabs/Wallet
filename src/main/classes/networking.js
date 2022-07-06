const net = require('net');

class Networking {
  constructor(nodeAddress, nodePort, walletInstance) {
    this.nodeAddress = nodeAddress;
    this.nodePort = nodePort;
    this.wallet = walletInstance;
  }

  async sendTransaction(receiverAddress, amount, networkFee) {
    console.log(this.wallet.crypto.blockchainAddress)
    let payload = {
      blockchainSenderAddress: this.wallet.crypto.blockchainAddress,
      blockchainReceiverAddress: receiverAddress,
      unitsToTransfer: amount,
      networkFee: networkFee,
    };

    let packet = this.createPacket(1, payload);
    console.log(packet);
    return JSON.parse(await this.sendPacket(packet, this.nodeAddress, this.nodePort)).payload.status;
  }

  createPacket(queryID, payload) {
    var packet = {
      queryID: queryID,
      unixTimestamp: Date.now() - 100,
      payload: payload,
      publicKey: this.wallet.crypto.publicKey,
    };

    var packetCopy = JSON.parse(JSON.stringify(packet));
    delete packetCopy.queryID;
    packet.signature = this.wallet.crypto.sign(JSON.stringify(packetCopy));

    return JSON.stringify(packet);
  }

  async sendPacket(packet, ipAddress, port, waitForAnswer = true) {
    let socket = new net.Socket();
    socket.setTimeout(3000);
    var response = '';
    var receivedResponsePromise = new Promise(function (resolve, reject) {
      socket.connect(port, ipAddress, () => {
        socket.write(packet);
      });

      socket.on('data', (data) => {
        response += data.toString();
        if (response.slice(-1) == Buffer.from([0x00]).toString('utf-8')) {
          response = response.slice(0, -1);
          socket.destroy();
          resolve();
        }
      });

      socket.on('error', (error) => {
        console.log(error);
        socket.destroy();
        reject();
      });

      socket.on('timeout', () => {
        socket.destroy();
        reject();
      });
    });

    await receivedResponsePromise;
    return response;
  }
}

module.exports = Networking;
