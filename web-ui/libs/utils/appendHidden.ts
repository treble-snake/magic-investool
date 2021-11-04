import {CompanyStock} from '../../../engine/src';

export const appendHidden = <T extends CompanyStock>(tickers: T[], hidden: Record<string, string>) => {
  return tickers.map(it => ({
    ...it,
    hidden: Boolean(hidden[it.ticker])
  }));
};