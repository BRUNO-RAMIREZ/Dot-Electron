const {BrowserWindow, screen} = require('electron');
const path = require('path');

let secondWindow = null;

function buildBrowserWindowFromRoute(mainWindow, route) {
  secondWindow = new BrowserWindow({
    fullscreen: true,
    alwaysOnTop: true,
    transparent: true,
    parent: mainWindow,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  secondWindow.loadURL(`http://localhost:4200/secure/full-screen/${route}`);
  secondWindow.webContents.openDevTools();

  return secondWindow;
}

function setIgnoreMouseEvents(event, ignore) {
  console.log(ignore, secondWindow)
  secondWindow && secondWindow.setIgnoreMouseEvents(ignore, {forward: true});
}

function destroySecondView() {
  if (!secondWindow) return;
  console.info('destroySecondView')
  secondWindow.destroy();
  secondWindow = undefined;
}

module.exports = {buildBrowserWindowFromRoute, setIgnoreMouseEvents, destroySecondView};
