import {PortfolioStorage} from '../portfoio/storage/PortfolioStorage.types';
import {HistoryStorage} from '../portfoio/storage/HistoryStorage.types';
import {filePortfolioStorage} from '../portfoio/storage/FilePortfolioStorage';
import {fileHistoryStorage} from '../portfoio/storage/FileHistoryStorage';
import {
  MagicFormulaStorage
} from '../magic-formula/storage/MagicFormulaStorage.types';
import {
  fileMagicFormulaStorage
} from '../magic-formula/storage/FileMagicFormulaStorage';
import * as config from '../common/config';
import {
  fileChangelogStorage
} from '../magic-formula/changelog/FileChangelogStorage';
import {
  ChangelogStorage
} from '../magic-formula/changelog/ChangelogStorage.types';
import {UserSettingsStorage} from '../user-settings/UserSettingsStorage.types';
import {
  fileUserSettingsStorage
} from '../user-settings/FileUserSettingsStorage';
import {UserAccountStorage} from '../user-settings/UserAccountStorage.types';
import {fileUserAccountStorage} from '../user-settings/FileUserAccountStorage';
import {KeyValueCache} from '../common/types/cache.types';
import {
  makeDefaultOverviewCache,
  OverviewCacheItem
} from '../enrichment/alphavantage/cache/OverviewCache';
import {
  IncomeCacheItem,
  makeDefaultIncomeCache
} from '../enrichment/alphavantage/cache/IncomeCache';
import {
  PriceQuote,
  RecommendationTrends
} from '../enrichment/finnhub/types/api';
import {
  makeDefaultPriceCache,
  PriceCacheItem
} from '../enrichment/finnhub/cache/PriceCache';
import {
  makeDefaultRecommendationCache, RecommendationCacheItem
} from '../enrichment/finnhub/cache/RecommendationCache';

export type AppContext = {
  portfolioStorage: PortfolioStorage,
  historyStorage: HistoryStorage,
  mfStorage: MagicFormulaStorage,
  mfChangelogStorage: ChangelogStorage,
  userSettingsStorage: UserSettingsStorage,
  userAccountStorage: UserAccountStorage,
  cache: {
    alphavantageOverview: KeyValueCache<OverviewCacheItem>,
    alphavantageIncome: KeyValueCache<IncomeCacheItem>,
    finnhubPrice: KeyValueCache<PriceCacheItem>,
    finnhubRecommendation: KeyValueCache<RecommendationCacheItem>,
  }
  config: typeof config
};

export const defaultContext = (): AppContext => {
  return {
    portfolioStorage: filePortfolioStorage(),
    historyStorage: fileHistoryStorage(),
    mfStorage: fileMagicFormulaStorage(),
    mfChangelogStorage: fileChangelogStorage(),
    userSettingsStorage: fileUserSettingsStorage(),
    userAccountStorage: fileUserAccountStorage(),
    cache: {
      alphavantageOverview: makeDefaultOverviewCache(),
      alphavantageIncome: makeDefaultIncomeCache(),
      finnhubPrice: makeDefaultPriceCache(),
      finnhubRecommendation: makeDefaultRecommendationCache()
    },
    config
  };
};