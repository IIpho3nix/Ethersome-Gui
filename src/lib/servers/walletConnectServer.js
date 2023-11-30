const ethers = require("ethers");
const sigutil = require("@metamask/eth-sig-util");
const WalletConnect = require("@walletconnect/client");

const ApproveRequest = async (payload, connector, wallet) => {
  if (payload.method === "personal_sign") {
    try {
      connector.approveRequest({
        id: payload.id,
        result: await wallet.signMessage(
          ethers.utils.arrayify(payload.params[0])
        ),
      });
    } catch (e) {
      connector.rejectRequest({
        id: payload.id,
        error: {
          code: "ERROR",
          message: "A Error Occured",
        },
      });
    }
  } else if (payload.method === "eth_sign") {
    try {
      connector.approveRequest({
        id: payload.id,
        result: await wallet.signMessage(
          ethers.utils.arrayify(payload.params[1])
        ),
      });
    } catch (e) {
      connector.rejectRequest({
        id: payload.id,
        error: {
          code: "ERROR",
          message: "A Error Occured",
        },
      });
    }
  } else if (payload.method === "eth_signTypedData") {
    try {
      const typedData = JSON.parse(payload.params[1]);
      const privateKey = Buffer.from(ethers.utils.arrayify(wallet.privateKey));
      const version = sigutil.SignTypedDataVersion.V4;
      const signature = sigutil.signTypedData({
        privateKey,
        data: typedData,
        version,
      });
      connector.approveRequest({
        id: payload.id,
        result: signature,
      });
    } catch (e) {
      connector.rejectRequest({
        id: payload.id,
        error: {
          code: "ERROR",
          message: "A Error Occured",
        },
      });
    }
  } else if (payload.method === "eth_sendTransaction") {
    try {
      const tx = {
        to: payload.params[0].to,
        from: payload.params[0].from,
        gasPrice: payload.params[0].gasPrice,
        gasLimit: payload.params[0].gas,
        value: payload.params[0].value,
        data: payload.params[0].data,
        nonce: payload.params[0].nonce,
      };
      const result = await wallet.sendTransaction(tx);
      connector.approveRequest({
        id: payload.id,
        result: result.hash,
      });
    } catch (e) {
      connector.rejectRequest({
        id: payload.id,
        error: {
          code: "ERROR",
          message: "A Error Occured",
        },
      });
    }
  } else if (payload.method === "eth_signTransaction") {
    try {
      const tx = {
        to: payload.params[0].to,
        from: payload.params[0].from,
        gasPrice: payload.params[0].gasPrice,
        gasLimit: payload.params[0].gas,
        value: payload.params[0].value,
        data: payload.params[0].data,
        nonce: payload.params[0].nonce,
      };
      const result = await wallet.signTransaction(tx);
      connector.approveRequest({
        id: payload.id,
        result: result,
      });
    } catch (e) {
      connector.rejectRequest({
        id: payload.id,
        error: {
          code: "ERROR",
          message: "A Error Occured",
        },
      });
    }
  } else if (payload.method === "eth_sendRawTransaction") {
    try {
      const tx = payload.params[0];
      const result = await wallet.sendTransaction(tx);
      connector.approveRequest({
        id: payload.id,
        result: result.hash,
      });
    } catch (e) {
      connector.rejectRequest({
        id: payload.id,
        error: {
          code: "ERROR",
          message: "A Error Occured",
        },
      });
    }
  }
};

exports.ApproveRequest = ApproveRequest;

const startServer = async (
  uri,
  address,
  chainId,
  callback,
  reqcallback,
  discallback
) => {
  var connector = new WalletConnect.default({
    uri: uri,
    clientMeta: {
      description: "EtherSome A Awesome Ethereum Wallet",
      url: "https://github.com/IIpho3nix/EtherSome-Gui",
      icons: [
        "https://raw.githubusercontent.com/IIpho3nix/Ethersome-Gui/main/src/assets/icons/logo.png",
      ],
      name: "EtherSome",
    },
  });

  connector.on("session_request", async (error, payload) => {
    if (error != null) {
      connector.killSession().catch(() => {});
      return;
    }

    connector.approveSession({
      accounts: [address],
      chainId: chainId,
    });
  });

  connector.on("call_request", async (error, payload) => {
    if (error != null) {
      connector.killSession().catch(() => {});
      return;
    }

    reqcallback(payload);
  });

  connector.on("disconnect", async (error, payload) => {
    discallback();
  });

  connector.createSession();

  callback(connector);
};

exports.startServer = startServer;
