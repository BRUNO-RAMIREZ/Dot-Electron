const {app, BrowserWindow, ipcMain, desktopCapturer, screen} = require('electron');
const path = require('path');

let mainWindow, secondWindow;

app.whenReady().then(initialize);

function initialize() {
  buildMainWindow();
  onBuildBrowserWindowFormRoute();
  onFullScreen();
  onIgnoreMouseEvents();
  onTakeScreenshot();
  initSeeSomething();
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
  // mainWindow.loadURL(`file://${__dirname}/dist/index.html`);
}

function onBuildBrowserWindowFormRoute() {
  ipcMain.on('buildBrowserWindowFormRoute', (event, route) => {
    destroySecondView();
    buildBrowserWindow(route);
  });
}

function buildBrowserWindow(route) {
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
}

function onIgnoreMouseEvents() {
  ipcMain.on('setIgnoreMouseEvents', setIgnoreMouseEvents);
}

function setIgnoreMouseEvents(event, ignore) {
  secondWindow && secondWindow.setIgnoreMouseEvents(ignore, {forward: true});
}

function onFullScreen() {
  ipcMain.on('setFullScreen', setFullScreen);
}

function setFullScreen(event, isFullScreen) {
  if (!mainWindow) return;

  isFullScreen && mainWindow.setPosition(0, 0);
  mainWindow.setMovable(!isFullScreen);
  mainWindow.setFullScreen(isFullScreen);
}

function onTakeScreenshot() {
  ipcMain.on('initTakeScreenshot', async (event) => {
    destroySecondView();
    mainWindow && mainWindow.hide();
    const screenshotBuffer = await buildScreenshotBuffer();
    if (!mainWindow) return;
    mainWindow.show();
    mainWindow.webContents.send('renderScreenshot', screenshotBuffer);
  });
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

function destroySecondView() {
  if (!secondWindow) return;
  secondWindow.destroy();
  secondWindow = undefined;
}

function initSeeSomething() {
  ipcMain.handle('initSeeSomething', async () => {
    const screenshotBuffer = await buildScreenshotBuffer();
    return screenshotBuffer;
  });
}
