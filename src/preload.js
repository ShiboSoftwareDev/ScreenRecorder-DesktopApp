const { contextBridge, ipcRenderer } = require("electron/renderer");

contextBridge.exposeInMainWorld("electronAPI", {
  videoSelectBtnClicked: () => ipcRenderer.send("videoSelectBtn-clicked"),
});
