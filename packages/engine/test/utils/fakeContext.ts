import {AppContext} from '../../src/context/context';
import * as config from '../../src/common/config';
import {
  AccountData,
  UserAccountStorage
} from '../../src/user-settings/UserAccountStorage.types';
import {emptyCache} from './emptyCache';

export const FAKE_ACCOUNT_DATA = Object.freeze({
  alphavantageApiKey: 'alphavantageApiKey',
  finnhubApiKey: 'finnhubApiKey',
  magicFormulaLogin: 'magicFormulaLogin',
  magicFormulaPassword: 'magicFormulaPassword',
  priceNotificationsEnabled: false,
  priceSchedulerIntervalMin: 60,
  priceSchedulerEnabled: false,
  stockUpdatesEnabled: true,
  stockUpdatesIntervalMin: 15
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
    cache: {
      alphavantageIncome: emptyCache(),
      alphavantageOverview: emptyCache(),
      finnhubRecommendation: emptyCache(),
      finnhubPrice: emptyCache()
    },
    ...override
  };
};
