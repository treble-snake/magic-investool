import {MagicCompany} from '../../common/companies';
import {differenceWith} from 'ramda';

export type StateComparison = {
  added: MagicCompany[],
  removed: MagicCompany[]
}

const tickerEquality = (a: MagicCompany, b: MagicCompany) => a.ticker === b.ticker;

export const compareState = (oldState: MagicCompany[], newState: MagicCompany[]): StateComparison => {
  return {
    added: differenceWith(tickerEquality, newState, oldState),
    removed: differenceWith(tickerEquality, oldState, newState)
  };
};