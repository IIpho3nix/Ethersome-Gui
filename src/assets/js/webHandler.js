const rsvbtn = document.getElementById("rsvbtn");
const resolvedurl = document.getElementById("resolvedurl");
const rsvinput = document.getElementById("rsvinput");

rsvbtn.onclick = () => {
    if (window.api.walletUtils.isNameServiceAddress(rsvinput.value)) {
        resolvedurl.innerHTML = "Resolving...";
        resolvedurl.removeAttribute("href");
        window.api.walletUtils.resolveNameServiceHash(rsvinput.value).then(res => {
            resolvedurl.innerHTML = "Click To Open In Browser";
            resolvedurl.href = res;
        }).catch(err => {
            resolvedurl.innerHTML = "Error Resolving Address";
            resolvedurl.removeAttribute("href");
        });
    }else{
        resolvedurl.innerHTML = "Invalid Name Service Address";
        resolvedurl.removeAttribute("href");
    }
};
