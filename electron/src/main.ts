import {app, BrowserWindow} from 'electron';
import {startServer} from './server';
import {createTrayIcon} from './standalone/tray';
import {createMainWindow} from './standalone/mainWindow';
import {ensureStorage} from './standalone/storage';
import {setupScheduledJobs} from './standalone/sheduler';

let tray = null;

export let backendPort: string | number;

ensureStorage();

app.whenReady()
  .then(() => startServer('app://-'))
  .then(async (port) => {
    backendPort = port;
    tray = createTrayIcon();
    createMainWindow();
    setupScheduledJobs().catch(e => console.error('Failed to setup jobs', e));

    app.on('activate', () => {
      app.dock.show();
      if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
      }
    });
  });

app.on('will-quit', () => {
  console.debug('Application is going to exit');
});

app.on('window-all-closed', function () {
  app.dock.hide();
  // // if (process.platform !== 'darwin') {
  // app.quit();
  // // }
});