import {differenceWith, eqProps} from 'ramda';
import {CompanyStock, CoreCompany} from '../../common/types/companies.types';

export type StateComparison = {
  added: CoreCompany[],
  removed: CompanyStock[],
  combined: (CoreCompany | CompanyStock)[],
}

export const compareState = (oldState: CompanyStock[], newState: CoreCompany[]): StateComparison => {
  const added = differenceWith(eqProps('ticker'), newState, oldState);
  const removed = differenceWith(eqProps('ticker'), oldState, newState);
  const combined = [
    ...differenceWith(eqProps('ticker'), oldState, removed),
    ...added
  ];

  return {
    added,
    removed,
    combined
  };
};