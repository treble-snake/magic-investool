import {app, BrowserWindow, Menu, nativeImage, Tray} from 'electron';
import path from 'path';
import {createMainWindow} from './mainWindow';

export function activateMainWindow() {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length === 0) {
    createMainWindow();
  } else {
    allWindows.forEach(it => it.restore());
  }
}

export const createTrayIcon = () => {
  const image = nativeImage.createFromPath(path.resolve(__dirname, '../../resources/tray@3x.png'));
  const tray = new Tray(image);
  const contextMenu = Menu.buildFromTemplate([
    {label: 'Show main window', type: 'normal', click: activateMainWindow},
    {label: 'About', type: 'normal', click: () => app.showAboutPanel()},
    {label: 'Quit', type: 'normal', click: () => app.quit()},
  ]);
  tray.setToolTip('This is my application.');
  tray.setContextMenu(contextMenu);

  return tray;
};