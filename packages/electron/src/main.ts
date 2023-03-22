import {app, BrowserWindow} from 'electron';
import {startServer} from './web-server/server';
import {createTrayIcon} from './standalone/tray';
import {createMainWindow} from './standalone/mainWindow';
import {ensureStorage} from './standalone/storage';
import {EventEmitter} from 'node:events';

let tray = null;

export let backendPort: string | number;
export const apiEvents = new EventEmitter({captureRejections: true});

ensureStorage();

app.whenReady()
  .then(() => startServer('app://-', apiEvents))
  .then(async (port) => {
    backendPort = port;
    tray = createTrayIcon();
    createMainWindow();

    // Have to use dynamic imports so ensureStorage() could kick in
    // before we import engine parts that require STORAGE_DIR to be set
    // Not ideal
    const {setupScheduledJobs} = await import('./standalone/scheduler/scheduler');
    setupScheduledJobs(apiEvents).catch(e => console.error('Failed to setup jobs', e));

    app.on('activate', () => {
      app.dock?.show();
      if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
      }
    });
  });

app.on('will-quit', () => {
  console.debug('Application is going to exit');
});

app.on('window-all-closed', function () {
  app.dock?.hide();
  // // if (process.platform !== 'darwin') {
  // app.quit();
  // // }
});