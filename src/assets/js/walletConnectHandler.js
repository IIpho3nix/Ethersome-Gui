const wcuri = document.getElementById("wcuri");

window.api.get((e, rtrn) => {
  window.api.screenshot(
    parseInt(rtrn.split(".")[0]) + 21,
    parseInt(rtrn.split(".")[1]) + 20,
    455,
    446,
    (rtn) => {
      if(rtn != null) {
        if(rtn.data.length > 0 && window.api.walletUtils.isWalletConnectUri(rtn.data)) {
          connect(rtn.data);
        }
      }
    }
  );
});

const connect = (uri) => {
  console.log(uri);
};

wcuri.addEventListener("input", () => {
  if (
    wcuri.value.length > 0 &&
    window.api.walletUtils.isWalletConnectUri(wcuri.value)
  ) {
    connect(wcuri.value);
  }
});

const scnbtn = document.getElementById("scnbtn");

scnbtn.onclick = () => {
  window.open("walletconnect://open");
};
