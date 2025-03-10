const {BrowserWindow, screen} = require('electron');
const path = require('path');

let secondWindow = null;

function buildBrowserWindow(mainWindow, route) {
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

  return secondWindow;
}

function setIgnoreMouseEvents(event, ignore) {
  console.log(ignore, secondWindow)
  secondWindow && secondWindow.setIgnoreMouseEvents(ignore, {forward: true});
}

function destroySecondView() {
  if (!secondWindow) return;
  secondWindow.destroy();
  secondWindow = undefined;
}

module.exports = {buildBrowserWindow, setIgnoreMouseEvents, destroySecondView};
