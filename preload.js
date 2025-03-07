const {contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  initScreenshot: () => ipcRenderer.send('initScreenshot'),
  takeScreenshot: () => ipcRenderer.send('takeScreenshot'),
  onRenderScreenshot: (callback) => ipcRenderer.on('renderScreenshot', (event, buffer) => callback(buffer)),
  setIgnoreMouseEvents: (ignore) => ipcRenderer.send('setIgnoreMouseEvents', ignore),
  setFullScreen: (isFullScreen) => ipcRenderer.send('setFullScreen', isFullScreen),
  removeRenderScreenshotListener: () => ipcRenderer.removeAllListeners('renderScreenshot')
});
