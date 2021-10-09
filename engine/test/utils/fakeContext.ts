import {AppContext} from '../../src';
import * as config from '../../src/common/config';
import {emptyCache} from './emptyCache';

export const fakeContext = (): AppContext => {
  return {
    yahooCache: emptyCache(),
    config,
    mfChangelogStorage: {} as any,
    portfolioStorage: {} as any,
    historyStorage: {} as any,
    mfStorage: {} as any
  }
};
