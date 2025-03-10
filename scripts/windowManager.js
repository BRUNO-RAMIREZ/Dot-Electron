const {BrowserWindow, screen} = require('electron');
const path = require('path');

let mainWindow = null;

function createMainWindow() {
  const {width, height, x, y} = screen.getPrimaryDisplay().workArea;
  const winSize = {width: 50, height: 50};

  mainWindow = new BrowserWindow({
    width: winSize.width,
    height: winSize.height,
    x: x + width - winSize.width,
    y: y + height - winSize.height - 10,
    alwaysOnTop: true,
    frame: false,
    transparent: true,
    resizable: false,
    movable: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      enableRemoteModule: false
    },
  });

  mainWindow.on('move', alignWindowToRightEdge);
  mainWindow.on('resize', alignWindowToRightEdge);
  mainWindow.on('closed', () => (mainWindow = null));

  mainWindow.setAlwaysOnTop(true, 'screen-saver');
  return mainWindow;
}

function alignWindowToRightEdge() {
  if (!mainWindow) return;

  const {width: screenWidth, height: screenHeight, x: screenX, y: screenY} = screen.getPrimaryDisplay().workArea;
  let {y, width, height} = mainWindow.getBounds();

  const newX = screenX + screenWidth - width;
  const newY = Math.max(Math.min(y, screenY + screenHeight - height), screenY);

  mainWindow.setBounds({x: newX, y: newY, width, height});
}

function setWindowBounds(width, height, alignY) {
  if (!mainWindow) return;

  const {width: screenWidth, height: screenHeight, x: screenX, y: screenY} = screen.getPrimaryDisplay().workArea;
  let {y: currentY, width: currentWidth, height: currentHeight} = mainWindow.getBounds();

  width = width < 0 ? screenWidth : width ?? currentWidth;
  height = height < 0 ? screenHeight : height ?? currentHeight;

  const newX = screenX + screenWidth - width;

  const newY =
    alignY !== undefined ?
      alignY
      : Math.max(Math.min(currentY, screenY + screenHeight - height), screenY);

  mainWindow.setBounds({x: newX, y: newY, width, height});
}

module.exports = {createMainWindow, setWindowBounds};
