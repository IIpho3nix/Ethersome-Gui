const ethers = require("ethers");
const ethersprovider = require("../providers/EthersProvider.js");
const fs = require("fs");
const cryptoUtils = require("./cryptoUtils.js");
const { default: Resolution } = require("@unstoppabledomains/resolution");
const resolution = new Resolution();

const getEthersProvider = async (mnemoniclength, providerkey) => {
  if (mnemoniclength == null || mnemoniclength == undefined) {
    mnemoniclength = 12;
  }

  const closest = (num, arr) => {
    var curr = arr[0];
    var diff = Math.abs(num - curr);
    for (var val = 0; val < arr.length; val++) {
      var newdiff = Math.abs(num - arr[val]);
      if (newdiff < diff) {
        diff = newdiff;
        curr = arr[val];
      }
    }
    return curr;
  };

  const bytescount = { 12: 16, 15: 20, 18: 24, 21: 28, 24: 32 };

  if (
    bytescount[mnemoniclength] == undefined &&
    bytescount[mnemoniclength] == null
  ) {
    const fallback = closest(mnemoniclength, Object.keys(bytescount));
    console.error(
      "mnemonic length of " +
        mnemoniclength +
        " is not supported\n supported lengths are 12, 15, 18, 21, 24\n falling back to closest length of " +
        fallback
    );
    mnemoniclength = fallback;
  }

  const mnemonic = ethers.utils.entropyToMnemonic(
    ethers.utils.randomBytes(bytescount[mnemoniclength])
  );

  return getEthersProviderFromMnemonic(mnemonic, providerkey);
};

exports.getEthersProvider = getEthersProvider;

const getEthersProviderFromMnemonic = async (mnemonic, providerkey) => {
  const wallet = ethers.Wallet.fromMnemonic(mnemonic);

  const provider = new ethers.providers.JsonRpcProvider(providerkey);

  return new ethersprovider.provider(wallet.connect(provider));
};

exports.getEthersProviderFromMnemonic = getEthersProviderFromMnemonic;

const getEthersProviderFromPrivateKey = async (privateKey, providerkey) => {
  const wallet = new ethers.Wallet(privateKey);

  const provider = new ethers.providers.JsonRpcProvider(providerkey);

  return new ethersprovider.provider(wallet.connect(provider));
};

exports.getEthersProviderFromPrivateKey = getEthersProviderFromPrivateKey;

const changeProviderRpc = async (ethwallet, providerkey) => {
  if (ethwallet.mnemonic != null && ethwallet.mnemonic != undefined) {
    return await getEthersProviderFromMnemonic(
      ethwallet.mnemonic.phrase,
      providerkey
    );
  } else if (
    ethwallet.privateKey != null &&
    ethwallet.privateKey != undefined
  ) {
    return await getEthersProviderFromPrivateKey(
      ethwallet.privateKey,
      providerkey
    );
  }
};

exports.changeProviderRpc = changeProviderRpc;

const getProvider = (network) => {
  const provider = new ethers.providers.InfuraProvider("mainnet");
  return "https://" + network + ".infura.io/v3/" + provider.apiKey;
};

exports.getProvider = getProvider;

const isValidMnemonic = (mnemonic) => {
  return ethers.utils.isValidMnemonic(mnemonic);
};

exports.isValidMnemonic = isValidMnemonic;

const isValidAddress = (address) => {
  return ethers.utils.isAddress(address);
};

exports.isValidAddress = isValidAddress;

const isValidKey = (key) => {
  try {
    const a = new ethers.Wallet(key);
  } catch (e) {
    return false;
  }
  return true;
};

exports.isValidKey = isValidKey;

const doesSavedWalletExist = () => {
  return fs.existsSync("wallet.eths");
};

exports.doesSavedWalletExist = doesSavedWalletExist;

const saveWallet = (wallet, provider, symbol, tokens, chains, password) => {
  const keyandiv = cryptoUtils.generateKeyAndIvFromSeed(password);
  const encryptedWallet = cryptoUtils.encrypt(
    wallet.privateKey + "|" + wallet.mnemonic.phrase,
    keyandiv.split("|")[0],
    cryptoUtils.base64ToBuffer(keyandiv.split("|")[1])
  );

  const tokenString = JSON.stringify(tokens);
  const chainsString = JSON.stringify(chains);

  fs.writeFileSync(
    "wallet.eths",
    encryptedWallet +
      "|" +
      tokenString +
      "|" +
      provider +
      "|" +
      symbol +
      "|" +
      chainsString
  );
};

exports.saveWallet = saveWallet;

const loadWallet = async (password) => {
  const keyandiv = cryptoUtils.generateKeyAndIvFromSeed(password);
  const encryptedWallet = fs.readFileSync("wallet.eths");
  const decryptedWallet = cryptoUtils.decrypt(
    encryptedWallet.toString().split("|")[0],
    keyandiv.split("|")[0],
    cryptoUtils.base64ToBuffer(keyandiv.split("|")[1])
  );

  const tokens = JSON.parse(encryptedWallet.toString().split("|")[1]);
  const chains = JSON.parse(encryptedWallet.toString().split("|")[4]);

  let wallet;

  if (decryptedWallet.split("|")[1] == null) {
    wallet = await getEthersProviderFromPrivateKey(
      decryptedWallet.split("|")[0],
      encryptedWallet.toString().split("|")[2]
    );
  } else {
    wallet = await getEthersProviderFromMnemonic(
      decryptedWallet.split("|")[1],
      encryptedWallet.toString().split("|")[2]
    );
  }

  return {
    wallet: wallet,
    tokens: tokens,
    provider: encryptedWallet.toString().split("|")[2],
    symbol: encryptedWallet.toString().split("|")[3],
    chains: chains,
  };
};

exports.loadWallet = loadWallet;

const getChainId = async (providerkey) => {
  const provider = new ethers.providers.JsonRpcProvider(providerkey);
  return (await provider.getNetwork()).chainId;
};

exports.getChainId = getChainId;

const symbolToName = async (symbol) => {
  const response = await ethers.utils.fetchJson(
    "https://api.coingecko.com/api/v3/coins/list"
  );
  const json = await response;
  for (let i = 0; i < json.length; i++) {
    if (json[i].symbol.toLowerCase() == symbol.toLowerCase()) {
      return json[i].name;
    }
  }
  return null;
};

exports.symbolToName = symbolToName;

const getPrice = async (amount, symbol, currency) => {
  const name = await symbolToName(symbol);
  if (name == null) {
    return null;
  } else {
    const response = await ethers.utils.fetchJson(
      "https://api.coingecko.com/api/v3/simple/price?ids=" +
        name +
        "&vs_currencies=" +
        currency
    );
    const json = await response;
    return json[name.toLowerCase()][currency.toLowerCase()] * amount;
  }
};

exports.getPrice = getPrice;

class token {
  constructor(tokenAddress, tokenSymbol, tokenName, tokenDecimals, tokenChain) {
    this.tokenAddress = tokenAddress;
    this.tokenSymbol = tokenSymbol;
    this.tokenName = tokenName;
    this.tokenDecimals = tokenDecimals;
    this.tokenChain = tokenChain;
    this.tokenABI = require("./AbiUtils.js").erc20;
  }
}

exports.token = token;

const createToken = (
  tokenAddress,
  tokenSymbol,
  tokenName,
  tokenDecimals,
  tokenChain
) => {
  return new token(
    tokenAddress,
    tokenSymbol,
    tokenName,
    tokenDecimals,
    tokenChain
  );
};

exports.createToken = createToken;

const getTokenSymbol = async (tokenAddress) => {
  const contract = new ethers.Contract(
    tokenAddress,
    require("./AbiUtils.js").erc20,
    ethers.Wallet.createRandom()
  );
  const symbol = await contract.symbol();
  return symbol;
};

exports.getTokenSymbol = getTokenSymbol;

class chain {
  constructor(chainId, chainName, chainSymbol, chainRPC, selected) {
    this.chainId = chainId;
    this.chainName = chainName;
    this.chainSymbol = chainSymbol;
    this.chainRPC = chainRPC;
    this.selected = selected;
  }
}

exports.chain = chain;

const createChain = (chainId, chainName, chainSymbol, chainRPC, selected) => {
  return new chain(chainId, chainName, chainSymbol, chainRPC, selected);
};

exports.createChain = createChain;

const defaultChains = [
  new chain(1, "Mainnet", "ETH", getProvider("mainnet"), true),
  new chain(3, "Ropsten", "ETH (Ropsten)", getProvider("ropsten"), false),
  new chain(4, "Rinkeby", "ETH (Rinkeby)", getProvider("rinkeby"), false),
  new chain(5, "Goerli", "ETH (Goerli)", getProvider("goerli"), false),
  new chain(42, "Kovan", "ETH (Kovan)", getProvider("kovan"), false),
  new chain(
    1337,
    "Localhost (Ganache)",
    "ETH (Ganache)",
    "http://localhost:8545",
    false
  ),
  new chain(
    31337,
    "Localhost (Hardhat)",
    "ETH (Hardhat)",
    "http://localhost:8545",
    false
  ),
];

exports.defaultChains = defaultChains;

const getChainfromName = (name, chainlist) => {
  for (let i = 0; i < chainlist.length; i++) {
    if (chainlist[i].chainName == name) {
      return chainlist[i];
    }
  }
  return null;
};

exports.getChainfromName = getChainfromName;

const getChainfromId = (id, chainlist) => {
  for (let i = 0; i < chainlist.length; i++) {
    if (chainlist[i].chainId == id) {
      return chainlist[i];
    }
  }
  return null;
};

exports.getChainfromId = getChainfromId;

const getSelectedChain = (chainlist) => {
  for (let i = 0; i < chainlist.length; i++) {
    if (chainlist[i].selected === true) {
      return chainlist[i];
    }
  }
  return null;
};

exports.getSelectedChain = getSelectedChain;

const setSelectedChain = (chainlist, chain) => {
  for (let i = 0; i < chainlist.length; i++) {
    if (
      chainlist[i].chainId == chain.chainId &&
      chainlist[i].chainName == chain.chainName &&
      chainlist[i].chainSymbol == chain.chainSymbol &&
      chainlist[i].chainRPC == chain.chainRPC
    ) {
      chainlist[i].selected = true;
    } else {
      chainlist[i].selected = false;
    }
  }

  chainlist.sort((a, b) => {
    if (a.selected) {
      return -1;
    }

    if (b.selected) {
      return 1;
    }

    return 0;
  });

  return chainlist;
};

exports.setSelectedChain = setSelectedChain;

const unslist = [
  ".zil",
  ".crypto",
  ".nft",
  ".blockchain",
  ".bitcoin",
  ".coin",
  ".wallet",
  ".888",
  ".dao",
  ".x",
];

const isNameServiceAddress = (address) => {
  const lindex = address.lastIndexOf(".");
  if (lindex !== -1) {
    return (
      unslist.includes(address.substring(lindex)) ||
      address.substring(lindex) === ".eth"
    );
  } else {
    return false;
  }

  return null;
};

exports.isNameServiceAddress = isNameServiceAddress;

const getNameServiceType = (address) => {
  const lindex = address.lastIndexOf(".");
  if (lindex !== -1) {
    if (unslist.includes(address.substring(lindex))) {
      return "uns";
    } else if (address.substring(lindex) === ".eth") {
      return "ens";
    }
  }

  return null;
};

exports.getNameServiceType = getNameServiceType;

const resolveNameServiceAdress = async (address, currency) => {
  if (isNameServiceAddress(address)) {
    const type = getNameServiceType(address);
    if (type === "uns") {
      return await resolution.addr(address, currency);
    } else if (type === "ens") {
      const wallet = (await getEthersProvider(12, getProvider("mainnet")))
        .wallet;
      return await wallet.provider.resolveName(address);
    }
  }

  return null;
};

exports.resolveNameServiceAdress = resolveNameServiceAdress;

const resolveNameServiceHash = async (address) => {
  if (isNameServiceAddress(address)) {
    const type = getNameServiceType(address);
    if (type === "uns") {
      return (
        "https://gateway.ipfs.io/ipfs/" + (await resolution.ipfsHash(address))
      );
    } else if (type === "ens") {
      const wallet = (await getEthersProvider(12, getProvider("mainnet")))
        .wallet;
      const hash = await (
        await wallet.provider.getResolver(address)
      ).getContentHash();
      if(hash !== null && hash !== undefined) {
        if (hash.startsWith("ipfs://")) {
          return "https://gateway.ipfs.io/ipfs/" + hash.substring(7);
        } else if (hash.startsWith("ipns://")) {
          return "https://gateway.ipfs.io/ipns/" + hash.substring(7);
        } else if (hash.startsWith("sia://")) {
          return "https://siasky.net/" + hash.substring(6);
        }
      }
    }
  }

  return null;
};

exports.resolveNameServiceHash = resolveNameServiceHash;

class currency {
  constructor(name, symbol, identifier, selected) {
    this.name = name;
    this.symbol = symbol;
    this.identifier = identifier;
    this.selected = selected;
  }
}

exports.currency = currency;

const createCurrency = (name, symbol, identifier, selected) => {
  return new currency(name, symbol, identifier, selected);
};

exports.createCurrency = createCurrency;

// Top 10 currencies by trading volume
// Taken from https://en.wikipedia.org/wiki/Template:Most_traded_currencies
const defaultCurrencies = [
  new currency("United States Dollar", "US$", "USD", true),
  new currency("Euro", "€", "EUR", false),
  new currency("Japanese Yen", "¥", "JPY", false),
  new currency("Pound Sterling", "£", "GBP", false),
  new currency("Australian Dollar", "A$", "AUD", false),
  new currency("Canadian Dollar", "C$", "CAD", false),
  new currency("Swiss Franc", "CHF", "CHF", false),
  new currency("Renminbi", "¥", "CNY", false),
  new currency("Hong Kong Dollar", "HK$", "HKD", false),
  new currency("New Zealand Dollar", "NZ$", "NZD", false),
];

exports.defaultCurrencies = defaultCurrencies;

const getCurrencyfromName = (name, currencylist) => {
  for (let i = 0; i < currencylist.length; i++) {
    if (currencylist[i].name == name) {
      return currencylist[i];
    }
  }
  return null;
};

exports.getCurrencyfromName = getCurrencyfromName;

const getCurrencyfromIdentifier = (identifier, currencylist) => {
  for (let i = 0; i < currencylist.length; i++) {
    if (currencylist[i].identifier == identifier) {
      return currencylist[i];
    }
  }
  return null;
};

exports.getCurrencyfromIdentifier = getCurrencyfromIdentifier;

const getSelectedCurrency = (currencylist) => {
  for (let i = 0; i < currencylist.length; i++) {
    if (currencylist[i].selected === true) {
      return currencylist[i];
    }
  }
  return null;
};

exports.getSelectedCurrency = getSelectedCurrency;

const setSelectedCurrency = (currencylist, currency) => {
  for (let i = 0; i < currencylist.length; i++) {
    if (currencylist[i].identifier == currency.identifier) {
      currencylist[i].selected = true;
    } else {
      currencylist[i].selected = false;
    }
  }

  currencylist.sort((a, b) => {
    if (a.selected) {
      return -1;
    }

    if (b.selected) {
      return 1;
    }

    return 0;
  });

  return currencylist;
};

exports.setSelectedCurrency = setSelectedCurrency;

const isWalletConnectUri = (uri) => {
  const regex = /wc:.*-.*-.*-.*-.*@1\?bridge=.*&key=.*/;

  return regex.exec(uri) !== null;
};

exports.isWalletConnectUri = isWalletConnectUri;
