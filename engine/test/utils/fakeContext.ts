import {AppContext} from '../../src/context/context';
import * as config from '../../src/common/config';
import {emptyCache} from './emptyCache';
import {
  UserAccountStorage
} from '../../src/user-settings/UserAccountStorage.types';

export const fakeContext = (override?: Partial<AppContext>): AppContext => {
  return {
    yahooCache: emptyCache(),
    config,
    mfChangelogStorage: {} as any,
    portfolioStorage: {} as any,
    historyStorage: {} as any,
    mfStorage: {} as any,
    userSettingsStorage: {} as any,
    userAccountStorage: {
      getAccountData() {
        return Promise.resolve({});
      }
    } as UserAccountStorage,
    ...override
  };
};
