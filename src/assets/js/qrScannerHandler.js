const scnbtn = document.getElementById("scnbtn");

scnbtn.onclick = () => {
  window.api.getPosition().then((pos) => {
    window.api.send(pos);
    window.api.close();
  });
};
