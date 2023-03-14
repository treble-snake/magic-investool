import {defaultContext} from '@investool/engine';
import {priceAlertJob} from './jobs/priceAlertJob';
import {AsyncTask, SimpleIntervalJob, ToadScheduler} from 'toad-scheduler';
import {EventEmitter} from 'node:events';
import {AccountData} from '@investool/web-ui/pages/api/account';
import {ApiEvent} from '../../web-server/types';

const PRICE_CHECK_JOB = 'PRICE_CHECK_JOB_ID';

const scheduler = new ToadScheduler();

// TODO: re-schedule only if necessary
const refreshJobs = async (setting: AccountData) => {
  const {priceSchedulerEnabled, priceSchedulerIntervalMin} = setting;
  if (scheduler.existsById(PRICE_CHECK_JOB)) {
    console.debug('Removing old price checking job');
    scheduler.removeById(PRICE_CHECK_JOB);
  }

  const needToStart =
    priceSchedulerEnabled &&
    priceSchedulerIntervalMin && priceSchedulerIntervalMin > 0;

  if (needToStart) {
    console.debug(`Setting up periodic price checks (every ${priceSchedulerIntervalMin} min)`);
    scheduler.addSimpleIntervalJob(
      new SimpleIntervalJob(
        {minutes: priceSchedulerIntervalMin},
        new AsyncTask('PriceChecker', priceAlertJob, errorHandler),
        {id: PRICE_CHECK_JOB}
      )
    );
  }
}

const errorHandler = (e: Error) => console.error('Scheduled job failed', e);

export const setupScheduledJobs = async (apiEvents: EventEmitter) => {
  console.debug('Setting up scheduled jobs');

  apiEvents.on('request', (event: ApiEvent) => {
    // not ideal; if API path or data format changes, this will break :-\
    if (event.method.toLowerCase() === 'post' && event.path === '/api/account') {
      console.debug('Re-scheduling jobs');
      refreshJobs(event.body);
    }
  });

  const context = defaultContext();
  return refreshJobs(await context.userAccountStorage.getAccountData());
};