const { contextBridge, ipcRenderer } = require("electron");
const jsqr = require("jsqr");

var globalscreenshotcb = async (id) => {};

const screenshot = (startX, startY, width, height, callback) => {
  var _this = this;
  this.callback = callback;
  this.imageFormat = "image/png";

  this.handleSteam = (stream) => {
    var video = document.createElement("video");
    video.style.cssText = "position: absolute;top:-10000px;left:-10000px;";

    video.onloadedmetadata = () => {
      video.style.height = video.videoHeight + "px";
      video.style.width = video.videoWidth + "px";

      video.play();

      var canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(
        video,
        startX,
        startY,
        width,
        height,
        0,
        0,
        width,
        height
      );

      if (this.callback) {
        const imagedata = ctx.getImageData(0, 0, width, height);
        this.callback(jsqr(imagedata.data, imagedata.width, imagedata.height));
      }

      video.remove();
      try {
        stream.getTracks()[0].stop();
      } catch (e) {}
    };

    video.srcObject = stream;
    document.body.appendChild(video);
  };

  globalscreenshotcb = async (id) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: "desktop",
            chromeMediaSourceId: id,
            minWidth: 1280,
            maxWidth: 4000,
            minHeight: 720,
            maxHeight: 4000,
          },
        },
      });

      _this.handleSteam(stream);
    } catch (e) {
      console.log(e);
    }
  };

  ipcRenderer.invoke("screenshot");
};

ipcRenderer.on("cb-screenshot", async (e, id) => {
  globalscreenshotcb(id);
});


contextBridge.exposeInMainWorld("api", {
  walletUtils: require("./utils/walletUtils.js"),
  get: (callback) => ipcRenderer.on("get", callback),
  screenshot: screenshot,
});