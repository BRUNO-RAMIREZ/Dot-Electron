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
    const y = data?.y;
    setWindowBounds(width, height, y);
  });

  ipcMain.on('SET_IGNORE_MOUSE_EVENTS', (event, payload) => {
    setIgnoreMouseEvents(event, payload.ignoreEvents);
  });

  ipcMain.on('SET_FULL_SCREEN', (event, payload) => {
    !payload.isFullScreen && destroySecondView();
    setFullScreen(event, payload.isFullScreen);
  });

  ipcMain.on('BUILD_BROWSER_WINDOW', (event, payload) => {
    destroySecondView();
    buildBrowserWindowFromRoute(mainWindow, payload.path);
  });

  ipcMain.on('INIT_TAKE_SCREENSHOT', async () => {
    destroySecondView();
    await initTakeScreenShot();
  });

  ipcMain.handle('INIT_SEE_SOMETHING', async () => {
    const screenshotBuffer = await buildScreenshotBuffer();
    return {screenshotBuffer};
  });
}

module.exports = {setupIPCHandlers};

const DtAction = {
  CHANGE_WINDOW_BOUNDS: 'CHANGE_WINDOW_BOUNDS',
};
