const {ipcMain, shell} = require('electron');
const {setWindowSize, maximizeHeight, maximizeWidth} = require('./windowManager');

function setupIPCHandlers(mainWindow) {
  ipcMain.on('open-url', (_, url) => {
    shell.openExternal(url);
  });

  ipcMain.on(DtAction.CHANGE_DIMENSIONS, (_, data) => {
    const width = data?.width;
    const height = data?.height;
    setWindowSize(width, height);
  });

  ipcMain.on(DtAction.MAX_HEIGHT, (_, data) => {
    maximizeHeight();
  });

  ipcMain.on(DtAction.MAX_WIDTH, (_, data) => {
    maximizeWidth();
  });
}

module.exports = {setupIPCHandlers};

const DtAction = {
  CHANGE_DIMENSIONS: 'CHANGE_DIMENSIONS',
};
