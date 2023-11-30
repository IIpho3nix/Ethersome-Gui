const electron = require("electron");
const { desktopCapturer } = require("electron");
const path = require("path");

var globalmainWindow = undefined;
var globalqrWindow = undefined;

const createWindow = () => {
  const mainWindow = new electron.BrowserWindow({
    width: 1600,
    minWidth: 1600,
    maxWidth: 1600,
    height: 900,
    minHeight: 900,
    maxHeight: 900,
    center: true,
    autoHideMenuBar: true,
    icon: path.join(__dirname, "assets/icons/logo.png"),
    webPreferences: {
      preload: path.join(__dirname, "lib/preload.js"),
    },
  });

  mainWindow.loadFile("./assets/html/index.html");

  mainWindow.webContents.openDevTools();

  globalmainWindow = mainWindow;
};

electron.app.whenReady().then(() => {
  electron.ipcMain.handle("get-qr-position", () => {
    return globalqrWindow.getBounds().x + "." + globalqrWindow.getBounds().y;
  });

  electron.ipcMain.handle("close-qr-window", () => {
    globalqrWindow.close();
  });

  electron.ipcMain.handle("send", (e, uri) => {
    globalmainWindow.webContents.send("get", uri);
  });

  electron.ipcMain.handle("screenshot", () => {
    desktopCapturer.getSources({ types: ['window', 'screen'] }).then(async sources => {
      for (const source of sources) {
        if((source.name === "Entire Screen" ) || (source.name === "Screen 1") || (source.name === "Screen 2")) {
          globalmainWindow.webContents.send("cb-screenshot", source.id);
          return;
        }
      }
    });
  });

  createWindow();
  electron.session.defaultSession.setPermissionRequestHandler(
    (webContents, permission, callback) => {
      if ((permission === "media") && (webContents == globalmainWindow.webContents)) {
          callback(true);
      } else {
        callback(false);
      }
    }
  );
});

electron.app.on("window-all-closed", () => {
  electron.app.quit();
});

electron.app.on("web-contents-created", (event, contents) => {
  contents.setWindowOpenHandler(({ url }) => {
    if (url === "walletconnect://open") {
      const qrwindow = new electron.BrowserWindow({
        width: 500,
        minWidth: 500,
        maxWidth: 500,
        height: 545,
        minHeight: 545,
        maxHeight: 545,
        center: true,
        autoHideMenuBar: true,
        icon: path.join(__dirname, "assets/icons/logo.png"),
        frame: true,
        transparent: true,
        webPreferences: {
          preload: path.join(__dirname, "lib/qrpreload.js"),
        },
      });

      qrwindow.loadFile("./assets/html/qr.html");

      globalqrWindow = qrwindow;

      return { action: "deny" };
    }
    return { action: "deny" };
  });

  contents.on("will-navigate", (event, navigationUrl) => {
    event.preventDefault();
    if (
      navigationUrl.startsWith("https://gateway.ipfs.io/ipfs/") || 
      navigationUrl.startsWith("https://gateway.ipfs.io/ipns/") ||
      navigationUrl.startsWith("https://siasky.net/")
    ) {
      electron.shell.openExternal(navigationUrl);
    }
  });

  contents.on("will-attach-webview", (event, webPreferences, params) => {
    delete webPreferences.preload;
    delete webPreferences.preloadURL;

    webPreferences.nodeIntegration = false;
    webPreferences.contextIsolation = true;
  });
});
