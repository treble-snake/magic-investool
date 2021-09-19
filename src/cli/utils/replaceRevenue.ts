import {omit, reverse} from 'ramda';
import {CompanyStock} from '../../common/types/companies.types';

export const replaceRevenue = (company: CompanyStock) => {
  const result: any = omit(['revenue'], company);
  result.revenueStr = {
    ...company.revenue,
    data: reverse(company.revenue.data).map(it => `${it.valueStr ?? '?'} (${it.date})`).join(' → ')
  };

  return result;
};