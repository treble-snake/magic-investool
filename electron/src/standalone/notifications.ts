import {Notification} from 'electron';
import {activateMainWindow} from './tray';

export function showNotification (title: string, text: string) {
  console.warn('showing notification');
  const notification = new Notification({
    title,
    body: text
  });
  notification.on('click', () => {
    activateMainWindow();
  })
  notification.show();
}