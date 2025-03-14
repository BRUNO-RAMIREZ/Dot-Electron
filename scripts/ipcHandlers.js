const {ipcMain, shell} = require('electron');
const {setIgnoreMouseEvents, destroySecondView, buildBrowserWindowFromRoute} = require('./secondWindowManager');
const {setWindowBounds, setFullScreen, initTakeScreenShot, buildScreenshotBuffer} = require('./windowManager');

function setupIPCHandlers(mainWindow) {
  ipcMain.on('open-url', (_, url) => {
    shell.openExternal(url);
  });

  ipcMain.on(DtAction.CHANGE_WINDOW_BOUNDS, (_, data) => {
    const width = data?.width;
    const height = data?.height;
    const x = data?.x;
    const y = data?.y;
    setWindowBounds(width, height, x, y);
  });

  ipcMain.on('setIgnoreMouseEvents', (event, url) => {
    setIgnoreMouseEvents(event, url);
  });

  ipcMain.on('setFullScreen', (event, isFullScreen) => {
    !isFullScreen && destroySecondView();
    setFullScreen(event, isFullScreen);
  });

  ipcMain.on('buildBrowserWindowFromRoute', (event, route) => {
    destroySecondView();
    buildBrowserWindowFromRoute(mainWindow, route);
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
