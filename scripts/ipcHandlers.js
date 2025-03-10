const {ipcMain, shell} = require('electron');
const {setIgnoreMouseEvents, destroySecondView, buildBrowserWindow} = require('./secondWindowManager');
const {setWindowBounds, setFullScreen, initTakeScreenShot, buildScreenshotBuffer} = require('./windowManager');

function setupIPCHandlers(mainWindow) {
  ipcMain.on('open-url', (_, url) => {
    shell.openExternal(url);
  });

  ipcMain.on(DtAction.CHANGE_WINDOW_BOUNDS, (_, data) => {
    const width = data?.width;
    const height = data?.height;
    const y = data?.y;
    setWindowBounds(width, height, y);
  });

  ipcMain.on('setIgnoreMouseEvents', (_, url) => {
    setIgnoreMouseEvents();
  });

  ipcMain.on('setFullScreen', (_, url) => {
    setFullScreen();
  });

  ipcMain.on('buildBrowserWindowFormRoute', (event, route) => {
    destroySecondView();
    buildBrowserWindow(mainWindow,route);
  });

  ipcMain.on('initTakeScreenshot', async (event) => {
    destroySecondView();
    await initTakeScreenShot();
  });

  ipcMain.handle('initSeeSomething', async () => {
    const screenshotBuffer = await buildScreenshotBuffer();
    return screenshotBuffer;
  });
}

module.exports = {setupIPCHandlers};

const DtAction = {
  CHANGE_WINDOW_BOUNDS: 'CHANGE_WINDOW_BOUNDS',
};
