import {PortfolioStorage} from '../portfoio/storage/PortfolioStorage.types';
import {HistoryStorage} from '../portfoio/storage/HistoryStorage.types';
import {filePortfolioStorage} from '../portfoio/storage/FilePortfolioStorage';
import {fileHistoryStorage} from '../portfoio/storage/FileHistoryStorage';
import {MagicFormulaStorage} from '../magic-formula/storage/MagicFormulaStorage.types';
import {fileMagicFormulaStorage} from '../magic-formula/storage/FileMagicFormulaStorage';

export type AppContext = {
  portfolioStorage: PortfolioStorage,
  historyStorage: HistoryStorage,
  mfStorage: MagicFormulaStorage
};

export const defaultContext = (): AppContext => {
  return {
    portfolioStorage: filePortfolioStorage(),
    historyStorage: fileHistoryStorage(),
    mfStorage: fileMagicFormulaStorage()
  };
};