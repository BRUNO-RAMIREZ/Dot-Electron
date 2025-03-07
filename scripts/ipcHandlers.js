const {ipcMain, shell} = require('electron');
const {toggleWindowSize} = require('./windowManager');

function setupIPCHandlers(mainWindow) {
  ipcMain.on('open-url', (_, url) => {
    shell.openExternal(url);
  });

  ipcMain.on('toggle-window-size', (_, isExpanded) => {
    toggleWindowSize(isExpanded);
  });

  ipcMain.on('mensaje', (event, data) => {
    shell.openExternal('https://www.google.com');
  });
}

module.exports = {setupIPCHandlers};
