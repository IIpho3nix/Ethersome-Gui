const walletUtils = window.api.walletUtils;

const create = () => {
  select(
    "Please sellect length of your mnemonic",
    ["12", "15", "18", "21", "24"],
    (length) => {
      walletUtils
        .getEthersProvider(parseInt(length), walletUtils.getProvider("mainnet"))
        .then((wallet) => {
          window.store.wallet = wallet;
        });
      window.store.chains = walletUtils.defaultChains;
      window.store.currencies = walletUtils.defaultCurrencies;
      document.body = window.store.body;
      document.onkeyup = (e) => {};
    },
    sellectWallet
  );
};

const mneimport = () => {
  select(
    "Please sellect length of your mnemonic",
    ["12", "15", "18", "21", "24"],
    (length) => {
      const mnemquestion = (string) => {
        getMnemonic(
          string,
          parseInt(length),
          (mnemonic) => {
            if (walletUtils.isValidMnemonic(mnemonic)) {
              walletUtils
                .getEthersProviderFromMnemonic(
                  mnemonic,
                  walletUtils.getProvider("mainnet")
                )
                .then((wallet) => {
                  window.store.wallet = wallet;
                });
              window.store.chains = walletUtils.defaultChains;
              window.store.currencies = walletUtils.defaultCurrencies;
              document.body = window.store.body;
              document.onkeyup = (e) => {};
            } else {
              mnemquestion("Wrong mnemonic! Please try again");
            }
          },
          sellectWallet
        );
      };
      mnemquestion("Please enter your mnemonic");
    },
    sellectWallet
  );
};

const prvimport = () => {
  const privquestion = (string) => {
    showInputBox(
      string,
      ["Private Key"],
      (input) => {
        const key = input[0];
        if (walletUtils.isValidKey(key)) {
          walletUtils
            .getEthersProviderFromPrivateKey(
              key,
              walletUtils.getProvider("mainnet")
            )
            .then((wallet) => {
              window.store.wallet = wallet;
            });
          window.store.chains = walletUtils.defaultChains;
          window.store.currencies = walletUtils.defaultCurrencies;
          document.body = window.store.body;
          document.onkeyup = (e) => {};
        } else {
          privquestion("Wrong Private Key! Please try again");
        }
      },
      sellectWallet
    );
  };
  privquestion("Please enter your private key");
};
