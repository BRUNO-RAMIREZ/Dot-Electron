const {app, BrowserWindow, ipcMain, desktopCapturer, screen} = require('electron');
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
    resizable: true,
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

function setFullScreen(event, isFullScreen) {
  if (!mainWindow) return;

  mainWindow.setMovable(!isFullScreen);
  mainWindow.setFullScreen(isFullScreen);
}

async function initTakeScreenShot() {
  mainWindow && mainWindow.hide();
  const screenshotBuffer = await buildScreenshotBuffer();
  if (!mainWindow) return;
  mainWindow.show();
  mainWindow.webContents.send('renderScreenshot', screenshotBuffer);
}

async function buildScreenshotBuffer() {
  const screenshot = await takeScreenshot();
  return screenshot.toPNG().buffer;
}

async function takeScreenshot() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const {width, height} = primaryDisplay.size;
  const optionsForCapture = {
    types: ['screen'],
    thumbnailSize: {width, height}
  };
  const sources = await desktopCapturer.getSources(optionsForCapture);

  const primarySource = sources.find(({display_id}) => display_id == primaryDisplay.id);
  const nativeImage = primarySource.thumbnail;

  return nativeImage;
}

module.exports = {createMainWindow, setWindowBounds, setFullScreen, initTakeScreenShot, buildScreenshotBuffer};
