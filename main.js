const {app, BrowserWindow, ipcMain, desktopCapturer, screen} = require('electron');
const path = require('path');

let mainWindow, secondWindow;

app.whenReady().then(initialize);

function initialize() {
  buildMainWindow();
  onInitScreenshot();
  onFullScreen();
}

function buildMainWindow() {
  mainWindow = new BrowserWindow({
    x: 0,
    y: 50,
    width: 40,
    height: 144,
    frame: false,
    alwaysOnTop: true,
    transparent: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadURL('http://localhost:4200');
}

function onInitScreenshot() {
  ipcMain.on('initScreenshot', buildSecondWindow);
}

function buildSecondWindow() {
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

  secondWindow.loadURL(`file://${__dirname}/dist/screenshot.html`);
  setIgnoreMouseEvents(undefined, true);
  onIgnoreMouseEvents();
  onTakeScreenshot();
}

function onIgnoreMouseEvents() {
  ipcMain.on('setIgnoreMouseEvents', setIgnoreMouseEvents);
}

function setIgnoreMouseEvents(event, ignore) {
  secondWindow.setIgnoreMouseEvents(ignore, {forward: true});
}

function onFullScreen() {
  ipcMain.on('setFullScreen', setFullScreen);
}

function setFullScreen(event, isFullScreen) {
  if (!mainWindow) return;

  isFullScreen && mainWindow.setPosition({x: 0, y: 0});
  mainWindow.setFullScreen(isFullScreen);
}

function onTakeScreenshot() {
  ipcMain.on('takeScreenshot', async (event) => {
    const screenshotBase64 = await buildScreenshotBase64();
    mainWindow && mainWindow.webContents.send('renderScreenshot', screenshotBase64);
  });
}

async function buildScreenshotBase64() {
  const screenshot = await takeScreenshot();
  return screenshot.toDataURL();
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
