class EthersProvider {
  constructor(wallet) {
    this.wallet = wallet;
    this.privateKey = wallet.privateKey;
    this.mnemonic = wallet.mnemonic;
    this.address = wallet.address;
  }

  signMessage = async (message) => {
    return this.wallet.signMessage(message);
  };

  sendTransaction = async (transaction) => {
    return this.wallet.sendTransaction(transaction);
  };

  signTransaction = async (transaction) => {
    return this.wallet.signTransaction(transaction);
  };
}

exports.provider = EthersProvider;
