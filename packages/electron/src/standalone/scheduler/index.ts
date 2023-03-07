import {defaultContext} from '@investool/engine';
import {priceAlertJob} from './jobs/priceAlertJob';
import {AsyncTask, SimpleIntervalJob, ToadScheduler} from 'toad-scheduler';

const scheduler = new ToadScheduler();

const errorHandler = (e: Error) => console.error('Scheduled job failed', e);

export const setupScheduledJobs = async () => {
  console.debug('Setting up scheduled jobs');

  const context = defaultContext();
  const {
    priceSchedulerEnabled,
    priceSchedulerIntervalMin
  } = await context.userAccountStorage.getAccountData();

  if (priceSchedulerEnabled && priceSchedulerIntervalMin && priceSchedulerIntervalMin > 0) {
    console.debug(`Setting up periodic price checks (every ${priceSchedulerIntervalMin} min)`);
    scheduler.addSimpleIntervalJob(
      new SimpleIntervalJob(
        {minutes: priceSchedulerIntervalMin},
        new AsyncTask('PriceChecker', priceAlertJob, errorHandler)
      )
    );
  }
};