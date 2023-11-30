const addOptionToSelect = (select, value) => {
  let opt = document.createElement("option");
  opt.value = value;
  opt.innerHTML = value;
  select.appendChild(opt);
};

const prvsellectHandler = () => {
  const providerselect = document.getElementById("prvselect");

  const refreshselect = () => {
    providerselect.innerHTML = "";
    const chains = window.store.chains;
    for (let i = 0; i < chains.length; i++) {
      let chain = chains[i];
      addOptionToSelect(
        providerselect,
        chain.chainName + (chain.selected ? " (Selected)" : "")
      );
    }
  };

  refreshselect();

  providerselect.onchange = () => {
    window.store.chains = window.api.walletUtils.setSelectedChain(
      window.store.chains,
      window.api.walletUtils.getChainfromName(
        providerselect.value,
        window.store.chains
      )
    );

    window.api.walletUtils
      .changeProviderRpc(
        window.store.wallet,
        window.api.walletUtils.getSelectedChain(window.store.chains).chainRPC
      )
      .then((wallet) => {
        window.store.wallet = wallet;
      });

    refreshselect();
  };
};

const crrsellectHandler = () => {
    const currencyselect = document.getElementById("crrselect");

    const refreshselect = () => {
      currencyselect.innerHTML = "";
      const currencies = window.store.currencies;
      for (let i = 0; i < currencies.length; i++) {
        let currency = currencies[i];
        addOptionToSelect(
          currencyselect,
          currency.name + (currency.selected ? " (Selected)" : "")
        );
      }
    }

    refreshselect();

    currencyselect.onchange = () => {
      window.store.currencies = window.api.walletUtils.setSelectedCurrency(
        window.store.currencies,
        window.api.walletUtils.getCurrencyfromName(
          currencyselect.value,
          window.store.currencies
        )
      );
      
      refreshselect();
    }
};

const askUserForChain = () => {
  const restore = document.body;
  const chains = [...window.store.chains];

  showInputBox(
    "Please Enter The Chain Details",
    ["Chain Name", "Chain Symbol", "Chain RPC", "Chain ID"],
    (values) => {
      chains.push(
        window.api.walletUtils.createChain(
          values[3],
          values[0],
          values[1],
          values[2],
          false
        )
      );
      window.store.chains = window.api.walletUtils.setSelectedChain(
        chains,
        window.api.walletUtils.getChainfromName(values[0], chains)
      );
      window.api.walletUtils
        .changeProviderRpc(
          window.store.wallet,
          window.api.walletUtils.getSelectedChain(window.store.chains).chainRPC
        )
        .then((wallet) => {
          window.store.wallet = wallet;
        });
      document.body = restore;
      prvsellectHandler();
    },
    () => {
      document.body = restore;
      prvsellectHandler();
    }
  );
};

const askUserForCurrency = () => {
  const restore = document.body;
  const currencies = [...window.store.currencies];

  showInputBox(
    "Please Enter The Currency Details",
    ["Currency Name", "Currency Symbol", "Currency ID"],
    (values) => {
      currencies.push(
        window.api.walletUtils.createCurrency(
          values[2],
          values[0],
          values[1],
          false
        )
      );
      window.store.currencies = window.api.walletUtils.setSelectedCurrency(
        currencies,
        window.api.walletUtils.getCurrencyfromName(values[0], currencies)
      );
      document.body = restore;
      crrsellectHandler();
    },
    () => {
      document.body = restore;
      crrsellectHandler();
    }
  );
}