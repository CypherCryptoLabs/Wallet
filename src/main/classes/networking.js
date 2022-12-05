const net = require('net');
const BigNumber = require('bignumber.js');

class Networking {
  constructor(nodeAddress, nodePort, walletInstance) {
    this.nodeAddress = nodeAddress;
    this.nodePort = nodePort;
    this.wallet = walletInstance;
  }

  async sendTransaction(receiverAddress, amount, networkFee) {
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

  async syncBlockchain() {
    let payload = {
        type:"request",
        blockHeight:(this.wallet.data.blockHeight == -1) ? 0 : this.wallet.data.blockHeight
    };

    let packet = this.createPacket(5, payload)
    let blockchainUpdate = JSON.parse(await this.sendPacket(packet, this.nodeAddress, this.nodePort));
    let localBlockchainAddress = this.wallet.crypto.blockchainAddress;

    for(i in blockchainUpdate.payload.blocks) {
        let block = blockchainUpdate.payload.blocks[i];
        if(this.wallet.data.blockHeight + 1 == block.id) {
            console.log()
            this.wallet.data.blockHeight = block.id
            if(block.rewardAddress == localBlockchainAddress) {
                this.wallet.data.balance += block.rewardAmount;
                this.wallet.data.transactions.push({unixTimestamp:block.timestamp, payload:{blockchainSenderAddress:"rewards", blockchainReceiverAddress:localBlockchainAddress, unitsToTransfer:block.rewardAmount, networkFee:0}, publicKey:"", signature:""})
            }

            for(var j in block.payload) {
                let transaction = block.payload[j];

                if(transaction.payload.blockchainSenderAddress == localBlockchainAddress) {
                    this.wallet.data.balance -= transaction.payload.unitsToTransfer + transaction.payload.networkFee;
                    this.wallet.data.transactions.push(transaction);
                }

                if(transaction.payload.blockchainReceiverAddress == localBlockchainAddress) {
                    this.wallet.data.balance += transaction.payload.unitsToTransfer;
                    this.wallet.data.transactions.push(transaction);
                }
            }

            if(block.validators) {
                let validators = Object.keys(block.validators);
                let localBlockchainAddressValidatorIndex = validators.indexOf(localBlockchainAddress);

                if(localBlockchainAddressValidatorIndex != -1 && block.validators[localBlockchainAddress] == "") {
                    this.wallet.data.balance -= 15;
                    this.wallet.data.transactions.push({unixTimestamp:block.timestamp, payload:{blockchainSenderAddress:"penalty", blockchainReceiverAddress:localBlockchainAddress, unitsToTransfer:-15, networkFee:0}, publicKey:"", signature:""})
                }

                for(var j in block.networkDiff.left) {
                    let node = block.networkDiff.left[j];
                    if(node.blockchainAddress == localBlockchainAddress) {
                        this.wallet.data.balance -= 1;
                        this.wallet.data.transactions.push({unixTimestamp:block.timestamp, payload:{blockchainSenderAddress:"penalty", blockchainReceiverAddress:localBlockchainAddress, unitsToTransfer:-1, networkFee:0}, publicKey:"", signature:""})

                    }
                }
            }
            
            this.wallet.data = this.wallet.data;
        }
    }
    return
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

  async getNodeList() {
    let packet = this.createPacket(11, {});
    let nodeList = JSON.parse(await this.sendPacket(packet, this.nodeAddress, this.nodePort)).payload.nodeList;

    return nodeList;
  }

  async sendMessage(address, message) {
    var nodeList = await this.getNodeList();
    let seedTimestamp = Date.now()
    let seed = this.wallet.crypto.hash(this.wallet.data.blockchainAddress + (seedTimestamp - (seedTimestamp % 3600000)) + address)
    nodeList.push({blockchainAddress: seed, registrationTimestamp: 0})

    let addressList = nodeList.filter(obj => obj.registrationTimestamp < (seedTimestamp - (seedTimestamp % 3600000))).map(function(e) {return e.blockchainAddress}).sort((a, b) => {
      let bigNumA = new BigNumber(a, 16)
      let bigNumB = new BigNumber(b, 16)

      if (bigNumA.isGreaterThanOrEqualTo(bigNumB)) {
          return 1;
      } else {
          return -1
      }
    });

    let fakeNodeIndex = addressList.indexOf(seed);
    var nodeToUse;
    if(fakeNodeIndex == 0) {
      nodeToUse = addressList[1]
    } else if(fakeNodeIndex == addressList.length - 1) {
      nodeToUse = addressList[fakeNodeIndex - 1]
    } else {
      let seedBigNum = new BigNumber(seed, 16)
      var differenceBiggerAddress = new BigNumber(addressList[fakeNodeIndex + 1].blockchainAddress, 16)
      var differenceSmallerAddress = new BigNumber(addressList[fakeNodeIndex - 1].blockchainAddress, 16)

      if(new BigNumber(differenceBiggerAddress.toString(16), 16).lt(new BigNumber(differenceSmallerAddress.toString(16), 16))) {
        nodeToUse = addressList[fakeNodeIndex - 1]
      } else {
        nodeToUse = addressList[fakeNodeIndex + 1]
      }
    }

    let nodeIndex = nodeList.map(function(e) {return e.blockchainAddress}).indexOf(nodeToUse);
    let node = nodeList[nodeIndex];

    let messagePacket = this.createPacket(8,
      {
        type:"send",
        blockchainReceiverAddress: address,
        message: message
      }
    )

    this.wallet.data.chats[address].push({message:message})
    this.wallet.data = this.wallet.data

    this.sendPacket(messagePacket, node.ipAddress, node.port)

  }
}

module.exports = Networking;
