const {ipcMain, shell} = require('electron');
const {setWindowBounds } = require('./windowManager');

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
}

module.exports = {setupIPCHandlers};

const DtAction = {
  CHANGE_WINDOW_BOUNDS: 'CHANGE_WINDOW_BOUNDS',
};
