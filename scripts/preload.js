const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  sendMessage: (channel, data) => ipcRenderer.send(channel, data),
  onMessage: (channel, callback) => ipcRenderer.on(channel, (event, ...args) => callback(...args)),
});

contextBridge.exposeInMainWorld('electronAPI', {
  initTakeScreenshot: () => ipcRenderer.send('initTakeScreenshot'),
  initSeeSomething: () => ipcRenderer.invoke('initSeeSomething'),
  onRenderScreenshot: (callback) => ipcRenderer.on('renderScreenshot', (event, buffer) => callback(buffer)),
  buildBrowserWindowFromRoute: (route) => ipcRenderer.send('buildBrowserWindowFromRoute', route),
  setIgnoreMouseEvents: (ignore) => ipcRenderer.send('setIgnoreMouseEvents', ignore),
  setFullScreen: (isFullScreen) => ipcRenderer.send('setFullScreen', isFullScreen),
});
