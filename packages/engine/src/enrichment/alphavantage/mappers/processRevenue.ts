import {
  CompanyIndicator,
  RevenueData
} from '../../../common/types/ranking.types';
import {prop, sort} from 'ramda';
import {FinancialReport} from '../types/api';

export const processRevenue = (incomeHistory: FinancialReport[]): CompanyIndicator<RevenueData> => {
  const data = sort(prop('timestamp'), incomeHistory.map((it) => ({
    timestamp: new Date(it.fiscalDateEnding).getTime(),
    date: it.fiscalDateEnding,
    value: Number.parseInt(it.totalRevenue) || 0,
    valueStr: it.totalRevenue
  })));

  return {
    score: 0,
    data
  };
};
