import {PortfolioStorage} from '../portfoio/storage/PortfolioStorage.types';
import {HistoryStorage} from '../portfoio/storage/HistoryStorage.types';
import {filePortfolioStorage} from '../portfoio/storage/FilePortfolioStorage';
import {fileHistoryStorage} from '../portfoio/storage/FileHistoryStorage';
import {MagicFormulaStorage} from '../magic-formula/storage/MagicFormulaStorage.types';
import {fileMagicFormulaStorage} from '../magic-formula/storage/FileMagicFormulaStorage';
import {
  makeDefaultYahooCache,
  YahooCacheItem
} from '../enrichment/cache/YahooCache';
import {KeyValueCache} from '../enrichment/cache/cache.types';
import * as config from '../common/config';

export type AppContext = {
  portfolioStorage: PortfolioStorage,
  historyStorage: HistoryStorage,
  mfStorage: MagicFormulaStorage,
  yahooCache: KeyValueCache<YahooCacheItem>,
  config: typeof config
};

export const defaultContext = (): AppContext => {
  return {
    portfolioStorage: filePortfolioStorage(),
    historyStorage: fileHistoryStorage(),
    mfStorage: fileMagicFormulaStorage(),
    yahooCache: makeDefaultYahooCache(),
    config
  };
};