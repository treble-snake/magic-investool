import {defaultContext} from '@investool/engine';
import {AsyncTask, SimpleIntervalJob, ToadScheduler} from 'toad-scheduler';
import {EventEmitter} from 'node:events';
import {AccountData} from '@investool/web-ui/pages/api/account';
import {ApiEvent} from '../../web-server/types';
import {updateCompanyData} from './jobs/updateCompanyData';
import {priceAlertJob} from './jobs/priceAlertJob';

const PRICE_CHECK_JOB = 'PRICE_CHECK_JOB_ID';
const COMPANY_UPDATES_JOB = 'COMPANY_UPDATES_JOB';

const scheduler = new ToadScheduler();
let previousState: Partial<AccountData>;

type JobSettings = {
  enabled: boolean;
  interval: number;
}
const setupJob = (
  {enabled, interval}: JobSettings,
  previousSettings: JobSettings | null,
  id: string,
  job: () => Promise<unknown>
) => {
  if (
    previousSettings !== null &&
    enabled === previousSettings.enabled &&
    interval === previousSettings.interval
  ) {
    // no need to update, settings haven't changed
    return;
  }

  if (scheduler.existsById(id)) {
    console.debug('Removing old price checking job');
    scheduler.removeById(id);
  }

  if (enabled && interval && interval > 0) {
    console.debug(`Setting up periodic price checks (every ${interval} min)`);
    scheduler.addSimpleIntervalJob(
      new SimpleIntervalJob(
        {minutes: interval},
        new AsyncTask(id, job, errorHandler),
        {id}
      )
    );
  }
};

const syncJobSettings = (
  setting: AccountData,
  previousState: Partial<AccountData> | null
) => {
  // price check and alert job
  const priceAlertSettings = {
    enabled: setting.priceSchedulerEnabled || false,
    interval: setting.priceSchedulerIntervalMin || 0
  };
  const priceAlertPrevSettings = {
    enabled: previousState?.priceSchedulerEnabled || false,
    interval: previousState?.priceSchedulerIntervalMin || 0
  };
  setupJob(
    priceAlertSettings,
    previousState ? priceAlertPrevSettings : null,
    PRICE_CHECK_JOB,
    priceAlertJob
  );

  // MF list and company data update job
  const companyUpdateSettings = {
    enabled: setting.stockUpdatesEnabled || false,
    interval: setting.stockUpdatesIntervalMin || 0
  };
  const companyUpdatePrevSettings = {
    enabled: previousState?.stockUpdatesEnabled || false,
    interval: previousState?.stockUpdatesIntervalMin || 0
  };
  setupJob(
    companyUpdateSettings,
    previousState ? companyUpdatePrevSettings : null,
    COMPANY_UPDATES_JOB,
    updateCompanyData
  );
};

const errorHandler = (e: Error) => console.error('Scheduled job failed', e);

export const setupScheduledJobs = async (apiEvents: EventEmitter) => {
  console.debug('Setting up scheduled jobs');

  const accountData = await defaultContext().userAccountStorage.getAccountData();
  syncJobSettings(accountData, null);
  previousState = accountData;

  apiEvents.on('request', (event: ApiEvent) => {
    // TODO: not ideal; if API path or data format changes, this will break :-\
    if (event.method.toLowerCase() === 'post' && event.path === '/api/account') {
      console.debug('Re-scheduling jobs');
      syncJobSettings(event.body, previousState);
      previousState = event.body;
    }
  });
};