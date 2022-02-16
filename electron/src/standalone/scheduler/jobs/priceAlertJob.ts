import {defaultContext, portfolioOperations} from '@investool/engine';
import {showNotification} from '../../notifications';

export const priceAlertJob = async () => {
  console.debug('Scheduled price check started');
  const context = defaultContext();

  const triggered = await portfolioOperations(context).checkPrices();
  console.debug('Scheduled price check complete');

  const {priceNotificationsEnabled} = await context.userAccountStorage.getAccountData();
  if (!priceNotificationsEnabled) {
    console.debug('Price check notifications are turned off');
    return;
  }

  console.debug(`Sending notifications for ${triggered.length} triggered items`);
  for (const ticker of triggered) {
    showNotification('Price alert', `Price for ${ticker} has reached the required value`);
  }
};