import {app, BrowserWindow} from 'electron';
import serve from 'electron-serve';
import {startServer} from './server';
import * as path from 'path';

const loadURL = serve({directory: 'static'});

function createWindow(backendPort: string | number) {
  const mainWindow = new BrowserWindow({
    width: 1400,
    height: 1000,
    webPreferences: {
      preload: path.resolve(__dirname, 'prepareFrontend.js'),
      additionalArguments: [`--backendPort=${backendPort}`]
    }
  });

  loadURL(mainWindow);
  if (process.env.DEBUG) {
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady()
  .then(() => startServer('app://-'))
  .then((port) => {
    createWindow(port);

    app.on('activate', function () {
      if (BrowserWindow.getAllWindows().length === 0) createWindow(port);
    });
  });

app.on('will-quit', () => {
  console.log('Killing child server process before quitting');
});

app.on('window-all-closed', function () {
  // if (process.platform !== 'darwin') {
  app.quit();
  // }
});