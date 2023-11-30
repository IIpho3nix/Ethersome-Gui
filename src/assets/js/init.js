const sellectWallet = () => {
  document.body = document.createElement("body");
  document.body.innerHTML = `
      <style>
        .wrapper {
          text-align: center;
          display: inline-block;
          position: absolute;
          top: 39%;
          left: 34%;
        }
  
        a {
          padding: 6px 6px 6px 6px;
          line-height: 5px;
          border-radius: 10px;
          display: inline-block;
          text-decoration: none;
          background-color: rgb(29, 29, 29);
          cursor: pointer;
        }
  
        a:hover {
          background-color: rgb(66, 66, 66);
        }
  
        a * {
          display: block;
          color: white;
        }
      </style>
  
      <div class="wrapper">
        <div class="fadein">
          <a onclick="create()"><img src="../icons/add.svg" width="150" height="150"><br><strong>Create New Wallet</strong><br><br><br><br><br><br></a>
          <a onclick="mneimport()"><img src="../icons/import.svg" width="150" height="150"><br><strong>Import Wallet <br><br><br><br>From Mnemonic</strong><br><br></a>
          <a onclick="prvimport()"><img src="../icons/import.svg" width="150" height="150"><br><strong>Import Wallet <br><br><br><br>From Private Key</strong><br><br></a>
        </div>
      </div>
    `;
};

sellectWallet();
