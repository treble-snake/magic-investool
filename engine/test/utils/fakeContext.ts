import {AppContext} from '../../src/context/context';
import * as config from '../../src/common/config';
import {emptyCache} from './emptyCache';

export const fakeContext = (override?: Partial<AppContext>): AppContext => {
  return {
    yahooCache: emptyCache(),
    config,
    mfChangelogStorage: {} as any,
    portfolioStorage: {} as any,
    historyStorage: {} as any,
    mfStorage: {} as any,
    userSettingsStorage: {} as any,
    ...override
  }
};
