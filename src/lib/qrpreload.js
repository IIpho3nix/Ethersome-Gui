const { contextBridge, ipcRenderer} = require("electron");

contextBridge.exposeInMainWorld("api", {
    getPosition: () => ipcRenderer.invoke("get-qr-position"),
    send: (uri) => ipcRenderer.invoke("send", uri),
    close: () => ipcRenderer.invoke("close-qr-window")
});
