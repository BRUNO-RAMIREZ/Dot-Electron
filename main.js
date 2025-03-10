const { app } = require('electron');
const { createMainWindow } = require('./scripts/windowManager');
const { setupIPCHandlers } = require('./scripts/ipcHandlers');

let mainWindow = null;

app.whenReady().then(() => {
  mainWindow = createMainWindow();
  setupIPCHandlers(mainWindow);

  // mainWindow.loadFile(`${__dirname}/dist/index.html`).then(() => {
  //   console.log('LOADED Successfully');
  // });
  mainWindow.loadURL('http://localhost:4200');
  mainWindow.webContents.openDevTools();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
