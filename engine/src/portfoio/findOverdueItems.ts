import {endOfMonth, isBefore, subYears} from 'date-fns';
import {PortfolioCompany} from '../common/types/companies.types';
import {filter, pipe, prop, sortBy} from 'ramda';

export const findOverdueItems = (companies: PortfolioCompany[], date = new Date()) => {
  const checkDate = endOfMonth(subYears(date, 1));
  const overdue = filter(
    (it: PortfolioCompany) => isBefore(new Date(it.purchaseDate), checkDate),
    companies
  );
  return sortBy(prop('purchaseDate'), overdue);
};