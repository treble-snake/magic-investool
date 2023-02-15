import {AppContext} from '../../src/context/context';
import * as config from '../../src/common/config';
import {emptyCache} from './emptyCache';
import {fakeFileStorage} from './fakeFileStorage';
import {
  fileUserAccountStorage
} from '../../src/user-settings/FileUserAccountStorage';

export const fakeApiKeys = (keys: string[]) => {
  const fakeAccountFile = fakeFileStorage({
    yahooApiKeys: keys.map(value => ({value}))
  } as any);

  return {
    userAccountStorage: fileUserAccountStorage(fakeAccountFile)
  };
};

export const fakeContext = (override?: Partial<AppContext>): AppContext => {
  return {
    yahooCache: emptyCache(),
    config,
    mfChangelogStorage: {} as any,
    portfolioStorage: {} as any,
    historyStorage: {} as any,
    mfStorage: {} as any,
    userSettingsStorage: {} as any,
    userAccountStorage: {} as any,
    ...override
  };
};
