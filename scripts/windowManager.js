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
      contextIsolation: true,  // Asegura que el contexto de la página está aislado
      nodeIntegration: false,  // Previene acceso a Node.js desde la página web
      enableRemoteModule: false
    },
  });

  mainWindow.on('move', alignWindowToRightEdge);
  mainWindow.on('resize', alignWindowToRightEdge);
  mainWindow.on('closed', () => (mainWindow = null));

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

function toggleWindowSize(isExpanded) {
  if (!mainWindow) return;

  const {width: screenWidth, height: screenHeight, x: screenX, y: screenY} = screen.getPrimaryDisplay().workArea;
  const newSize = isExpanded ? {width: 250, height: 180} : {width: 60, height: 60};

  let {y} = mainWindow.getBounds();

  const newX = screenX + screenWidth - newSize.width;
  const newY = Math.max(Math.min(y, screenY + screenHeight - newSize.height), screenY);

  mainWindow.setBounds({x: newX, y: newY, width: newSize.width, height: newSize.height});
  alignWindowToRightEdge();
}

module.exports = {createMainWindow, toggleWindowSize};
