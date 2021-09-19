import {endOfMonth, isBefore, subYears} from 'date-fns';
import {PortfolioCompany} from '../common/types/companies.types';
import {compose, filter, prop, sortBy} from 'ramda';

export const findOverdueItems = (companies: PortfolioCompany[], date = new Date()) => {
  const checkDate = endOfMonth(subYears(date, 1));
  return compose(
    filter((it: PortfolioCompany) => isBefore(new Date(it.purchaseDate), checkDate)),
    sortBy(prop('purchaseDate'))
  )(companies);
};