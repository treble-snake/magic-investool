import {AppContext} from '../../src/context/context';
import * as config from '../../src/common/config';
import {
  AccountData,
  UserAccountStorage
} from '../../src/user-settings/UserAccountStorage.types';

export const FAKE_ACCOUNT_DATA = Object.freeze({
  alphavantageApiKey: 'alphavantageApiKey',
  magicFormulaLogin: 'magicFormulaLogin',
  magicFormulaPassword: 'magicFormulaPassword',
  priceNotificationsEnabled: false,
  priceSchedulerIntervalMin: 60,
  priceSchedulerEnabled: false
}) as AccountData;

export const fakeContext = (override?: Partial<AppContext>): AppContext => {
  return {
    config,
    mfChangelogStorage: {} as any,
    portfolioStorage: {} as any,
    historyStorage: {} as any,
    mfStorage: {} as any,
    userSettingsStorage: {} as any,
    userAccountStorage: {
      getAccountData: () => Promise.resolve(FAKE_ACCOUNT_DATA)
    } as UserAccountStorage,
    ...override
  };
};
