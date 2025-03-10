const {contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  initTakeScreenshot: () => ipcRenderer.send('initTakeScreenshot'),
  initSeeSomething: () => ipcRenderer.invoke('initSeeSomething'),
  onRenderScreenshot: (callback) => ipcRenderer.on('renderScreenshot', (event, buffer) => callback(buffer)),
  buildBrowserWindowFormRoute: (route) => ipcRenderer.send('buildBrowserWindowFormRoute', route),
  setIgnoreMouseEvents: (ignore) => ipcRenderer.send('setIgnoreMouseEvents', ignore),
  setFullScreen: (isFullScreen) => ipcRenderer.send('setFullScreen', isFullScreen),
  removeRenderScreenshotListener: () => ipcRenderer.removeAllListeners('renderScreenshot'),
});
