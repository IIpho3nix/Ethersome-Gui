const getStyle = (height) => {
  return `
          .box {
              height: ${height}px;
              width: 300px;
              padding: 40px;
              position: absolute;
              top: 25%;
              left: 38%;
              background: #191919;
              text-align: center;
              border-radius: 12px;
          }
  
          .box h1 {
              color: white;
              font-weight: 500;
          }
  
          .box input[type = "text"],.box input[type = "password"] {
              border:0;
              background: none;
              display: block;
              margin: 20px auto;
              text-align: center;
              border: 2px solid #3498db;
              padding: 14px 10px;
              width: 250px;
              outline: none;
              color: white;
              border-radius: 18px;
              transition: 0.25s;
          }
  
          .box input[type = "text"]:focus,.box input[type = "password"]:focus {
              width: 280px;
              border-color: #2ecc71;
          }
  
          .box input[type = "submit"] {
              border:0;
              background: none;
              display: block;
              margin: 20px auto;
              text-align: center;
              border: 2px solid #2ecc71;
              padding: 14px 40px;
              outline: none;
              color: white;
              border-radius: 18px;
              transition: 0.25s;
              cursor: pointer;
          }
  
          .box input[type = "submit"]:hover {
              background: #2ecc71;
          }
  
          select {
              text-align-last: center;
              text-align: center;
              margin: 50px;
              width: 150px;
              font-size: 16px;
              border: 1px solid #ccc;
              height: 34px;
              -webkit-appearance: none;
              -moz-appearance: none;
              appearance: none;
              color: #fff;
              background-color: rgb(32, 32, 32);;
              border: none;
              border-radius: 5px;
              cursor: pointer;
          }
      `;
};

var clback = (value) => {};

const showInputBox = (text, list, callback, exit) => {
  clback = callback;
  document.body = document.createElement("body");
  document.body.innerHTML = `  
          <style>
              ${getStyle(230 + list.length * 60)}
          </style>
  
          <div class="box fadein" id="box">
              <h1>${text}</h1>  
          </div>
  `;

  const box = document.getElementById("box");

  let ids = [];

  for (var i = 0; i < list.length; i++) {
    let opt = document.createElement("input");
    opt.type = "text";
    opt.id = "text" + i;
    ids.push("text" + i);
    opt.placeholder = list[i];
    box.appendChild(opt);
  }

  let confirm = document.createElement("input");
  confirm.type = "submit";
  confirm.value = "Confirm";
  confirm.id = "confirm";
  confirm.onclick = () => {
    let values = [];
    for (var i = 0; i < ids.length; i++) {
      values.push(document.getElementById(ids[i]).value);
    }
    clback(values);
  };

  box.appendChild(confirm);

  document.onkeyup = (e) => {
    if (e.keyCode == 13) {
      document.getElementById("confirm").click();
    }
    if (e.keyCode == 27) {
      exit();
    }
  };
};

const YorN = (question, callback, exit) => {
  clback = callback;
  document.body = document.createElement("body");
  document.body.innerHTML = `  
            <style>
              ${getStyle(310)}
            </style>
    
            <div class="box fadein">
                <h1>${question}</h1>
                <div>
                  <input type="submit" value="Yes" onclick="clback(true)">
                  <input type="submit" value="No" onclick="clback(false)">
                </div>
            </div>
  `;

  document.onkeyup = (e) => {
    if (e.keyCode == 27) {
      exit();
    }
  };
};

const select = (text, list, callback, exit) => {
  clback = callback;
  document.body = document.createElement("body");
  document.body.innerHTML = `  
              <style>
                ${getStyle(380)}
              </style>
      
              <div class="box fadein">
                  <h1>${text}</h1>
                  <select id="slc">
                  </select>
                  <input id="confirm" type="submit" value="Confirm" onclick="clback(document.getElementById('slc').value)">
              </div>
  `;

  let slc = document.getElementById("slc");
  for (var i = 0; i < list.length; i++) {
    let opt = document.createElement("option");
    opt.value = list[i];
    opt.innerHTML = list[i];
    slc.appendChild(opt);
  }

  document.onkeyup = (e) => {
    if (e.keyCode == 13) {
      document.getElementById("confirm").click();
    }
    if (e.keyCode == 27) {
      exit();
    }
  };
};

const getMnemonic = (text, count, callback, exit) => {
  clback = callback;
  document.body = document.createElement("body");
  document.body.innerHTML = `  
      <style>
        ${getStyle(270)}
      </style>

      <div class="box fadein" id="box">
        <h1>${text}</h1>  
      </div>
  `;

  const box = document.getElementById("box");

  let ids = [];
  let current = 0;
  let oldchild = null;
  let oldconfirm = null;

  const add = () => {
    if (oldchild != null) {
      box.removeChild(oldchild);
    }

    let opt = document.createElement("input");
    opt.type = "text";
    opt.id = "text";
    ids.push("text");
    opt.placeholder = "Word " + (current + 1);
    box.appendChild(opt);
    current++;
    oldchild = opt;
  };

  let mnemonic = "";

  const addconfirm = () => {
    if (oldconfirm != null) {
      box.removeChild(oldconfirm);
    }

    let confirm = document.createElement("input");
    confirm.type = "submit";
    confirm.value = "Confirm";
    confirm.id = "confirm";
    confirm.onclick = () => {
      if (current < count) {
        mnemonic += document.getElementById("text").value + " ";
        add();
        addconfirm();
      } else {
        mnemonic += document.getElementById("text").value;
        clback(mnemonic);
      }
    };
    box.appendChild(confirm);
    oldconfirm = confirm;

    document.onkeyup = (e) => {
      if (e.keyCode == 13) {
        document.getElementById("confirm").click();
      }
      if (e.keyCode == 27) {
        exit();
      }
    };
  };

  add();
  addconfirm();
};
