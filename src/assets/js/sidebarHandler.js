let main = document.getElementById("main");
let wc = document.getElementById("wc");
let web = document.getElementById("web");
let settings = document.getElementById("settings");
let amain = document.getElementById("amain");
let awc = document.getElementById("awc");
let aweb = document.getElementById("aweb");
let asettings = document.getElementById("asettings");
let ethicon = document.getElementById("ethicon");
let wcicon = document.getElementById("wcicon");
let webicon = document.getElementById("webicon");

const ethiconcss = `
  .ethicon {
    animation: sat-remove-color 0.5s;
    animation-fill-mode: forwards;
  }
  
  .ethicon:hover {
    animation: sat-add-color 0.5s;
    animation-fill-mode: forwards;
  }
`;

const iconcss = `
  .icon {
    animation: remove-color 0.5s;
    animation-fill-mode: forwards;
  }
  
  .icon:hover {
    animation: add-color 0.5s;
    animation-fill-mode: forwards;
  }
`;

const acss = `
  .sidebar a {
    width: 50px;
    margin-left: 14px;
    padding: 6px 6px 6px 14px;
    text-decoration: none;
    display: block;
    border-radius: 10px;
    background-color: rgb(29, 29, 29);
  }
  
  .sidebar a:hover {
    background-color: rgb(66, 66, 66);
  }
`;

const settingscss = `
  .sidebar a {
    width: 50px;
    margin-left: 14px;
    padding: 6px 6px 6px 14px;
    text-decoration: none;
    display: block;
    border-radius: 10px;
    background-color: rgb(29, 29, 29);
  }

  .sidebar a:hover {
    background-color: rgb(66, 66, 66);
  }

  #asettings {
    margin-top: 640px;
  }
`;

main.style.display = "";
wc.style.display = "none";
web.style.display = "none";

const mainclick = () => {
  main.style.display = "";
  wc.style.display = "none";
  web.style.display = "none";
  settings.style.display = "none";
  amain.style.backgroundColor = "#424242";
  awc.style.cssText = acss;
  aweb.style.cssText = acss;
  asettings.style.cssText = settingscss;
  ethicon.classList.remove("animation");
  ethicon.classList.add("animation");
  ethicon.style.animation = "sat-add-color";
  ethicon.style.animationFillMode = "forwards";
  wcicon.style.cssText = iconcss;
  webicon.style.cssText = iconcss;
};

const wcclick = () => {
  main.style.display = "none";
  wc.style.display = "";
  web.style.display = "none";
  settings.style.display = "none";
  awc.style.backgroundColor = "#424242";
  aweb.style.cssText = acss;
  amain.style.cssText = acss;
  asettings.style.cssText = settingscss;
  wcicon.classList.remove("animation");
  wcicon.classList.add("animation");
  wcicon.style.animation = "add-color";
  wcicon.style.animationFillMode = "forwards";
  ethicon.style.cssText = ethiconcss;
  webicon.style.cssText = iconcss;
};

const webclick = () => {
  main.style.display = "none";
  wc.style.display = "none";
  web.style.display = "";
  settings.style.display = "none";
  aweb.style.backgroundColor = "#424242";
  amain.style.cssText = acss;
  awc.style.cssText = acss;
  asettings.style.cssText = settingscss;
  webicon.classList.remove("animation");
  webicon.classList.add("animation");
  webicon.style.animation = "add-color";
  webicon.style.animationFillMode = "forwards";
  ethicon.style.cssText = ethiconcss;
  wcicon.style.cssText = iconcss;
};

const settingsclick = () => {
  main.style.display = "none";
  wc.style.display = "none";
  web.style.display = "none";
  settings.style.display = "";
  asettings.style.backgroundColor = "#424242";
  amain.style.cssText = acss;
  awc.style.cssText = acss;
  aweb.style.cssText = acss;
  webicon.style.cssText = iconcss;
  wcicon.style.cssText = iconcss;
  ethicon.style.cssText = ethiconcss;
  prvsellectHandler();
  crrsellectHandler();
};

mainclick();

window.store = {};

window.store.body = document.body;
