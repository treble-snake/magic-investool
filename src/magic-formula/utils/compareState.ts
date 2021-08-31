import {MagicCompany} from '../../common/companies';
import {differenceWith} from 'ramda';

export type StateComparison = {
  added: MagicCompany[],
  removed: MagicCompany[],
  combined: MagicCompany[],
}

const tickerEquality = (a: MagicCompany, b: MagicCompany) => a.ticker === b.ticker;

export const compareState = (oldState: MagicCompany[], newState: MagicCompany[]): StateComparison => {
  const added = differenceWith(tickerEquality, newState, oldState);
  const removed = differenceWith(tickerEquality, oldState, newState);
  const combined = differenceWith(tickerEquality, oldState, removed)
    .concat(...added);

  return {
    added,
    removed,
    combined
  };
};