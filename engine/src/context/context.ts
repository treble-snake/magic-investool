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
import {KeyValueCache} from '../common/types/cache.types';
import * as config from '../common/config';
import {fileChangelogStorage} from '../magic-formula/changelog/FileChangelogStorage';
import {ChangelogStorage} from '../magic-formula/changelog/ChangelogStorage.types';
import {UserSettingsStorage} from '../user-settings/UserSettingsStorage.types';
import {fileUserSettingsStorage} from '../user-settings/FileUserSettingsStorage';
import {UserAccountStorage} from '../user-settings/UserAccountStorage.types';
import {fileUserAccountStorage} from '../user-settings/FileUserAccountStorage';

export type AppContext = {
  portfolioStorage: PortfolioStorage,
  historyStorage: HistoryStorage,
  mfStorage: MagicFormulaStorage,
  mfChangelogStorage: ChangelogStorage,
  userSettingsStorage: UserSettingsStorage,
  userAccountStorage: UserAccountStorage,
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
    config
  };
};