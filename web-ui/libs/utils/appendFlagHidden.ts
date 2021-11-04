import {identity, indexBy} from 'ramda';
import {CompanyStock} from '../../../engine/src';

export const appendFlagHidden = (hiddenList: string[]) => {
  const hiddenById = indexBy(identity, hiddenList);

  return <T extends CompanyStock>(tickers: T[]) => {
    return tickers.map(it => ({
      ...it,
      hidden: Boolean(hiddenById[it.ticker])
    }));
  };
};
