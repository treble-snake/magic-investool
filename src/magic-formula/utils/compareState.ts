import {differenceWith} from 'ramda';
import {CoreCompany} from '../../common/companies';

export type StateComparison = {
  added: CoreCompany[],
  removed: CoreCompany[],
  combined: CoreCompany[],
}

const tickerEquality = (a: CoreCompany, b: CoreCompany) => a.ticker === b.ticker;

export const compareState = (oldState: CoreCompany[], newState: CoreCompany[]): StateComparison => {
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