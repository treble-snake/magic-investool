import {PortfolioStorage} from '../portfoio/storage/PortfolioStorage.types';
import {HistoryStorage} from '../portfoio/storage/HistoryStorage.types';
import {filePortfolioStorage} from '../portfoio/storage/FilePortfolioStorage';
import {fileHistoryStorage} from '../portfoio/storage/FileHistoryStorage';
import {MagicFormulaStorage} from '../magic-formula/storage/MagicFormulaStorage.types';
import {fileMagicFormulaStorage} from '../magic-formula/storage/FileMagicFormulaStorage';
import {
  KeyValueCache,
  makeDefaultYahooCache, YahooCacheItem
} from '../enrichment/cache/YahooCache';

export type AppContext = {
  portfolioStorage: PortfolioStorage,
  historyStorage: HistoryStorage,
  mfStorage: MagicFormulaStorage,
  yahooCache: KeyValueCache<YahooCacheItem>
};

export const defaultContext = (): AppContext => {
  return {
    portfolioStorage: filePortfolioStorage(),
    historyStorage: fileHistoryStorage(),
    mfStorage: fileMagicFormulaStorage(),
    yahooCache: makeDefaultYahooCache()
  };
};