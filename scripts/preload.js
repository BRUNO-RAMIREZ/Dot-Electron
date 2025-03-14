const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  sendMessage: (channel, data) => ipcRenderer.send(channel, data),
  onMessage: (channel, callback) =>
      ipcRenderer.on(channel, (event, ...args) => callback(...args)),
  invoke: (channel, data) => ipcRenderer.invoke(channel, data),
  removeListener: (channel) => ipcRenderer.removeAllListeners(channel)
});
