import {BrowserWindow} from 'electron';
import path from 'path';
import serve from 'electron-serve';
import {backendPort} from '../main';

const loadURL = serve({directory: 'static'});

export const createMainWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1400,
    height: 1000,
    show: false,
    webPreferences: {
      preload: path.resolve(__dirname, 'prepareFrontend.js'),
      additionalArguments: [`--backendPort=${backendPort}`]
    }
  });

  loadURL(mainWindow);
  mainWindow.maximize();
  mainWindow.show();

  if (process.env.DEBUG) {
    mainWindow.webContents.openDevTools();
  }
}