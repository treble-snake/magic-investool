import {CompanyStock, CoreCompany} from '../common/types/companies.types';
import {
  InsightRecommendationType,
  ValuationType
} from '../common/types/ranking.types';
import {setMilliseconds, subYears} from 'date-fns';
import {mergeDeepLeft} from 'ramda';

export type EnrichableCompany =
  Partial<CoreCompany>
  & Pick<CoreCompany, 'ticker'>;

export const completeCompanyData = <T extends EnrichableCompany>(core: T): T & CompanyStock => {
  const lastYear = setMilliseconds(subYears(new Date(), 1), 0).toISOString();
  const empty = {
    // new
    overview: {
      marketCap: 0,
      peRatio: 0,
      analystTargetPrice: 0
    },
    lastUpdates: {
      alphavantageOverview: lastYear,
      alphavantageIncome: lastYear,
      finnhubRecommendation: lastYear,
      finnhubPrice: lastYear
    },
    // old, TODO: evaluate
    sector: '',
    sectorScore: 0,
    price: null,
    industry: '',
    country: '',
    revenue: {
      data: [],
      score: 0
    },
    valuation: {
      data: {
        type: ValuationType.Unknown,
        percentage: 0
      },
      score: 0
    },
    recommendation: {
      data: {
        trend: {
          date: lastYear,
          buy: 0,
          hold: 0,
          sell: 0,
          strongBuy: 0,
          strongSell: 0,
        },
        insight: {
          type: InsightRecommendationType.Unknown,
          price: 0
        }
      },
      score: 0
    },
    lastUpdated: lastYear,
    rank: {
      byRecommendation: 0,
      byRevenue: 0,
      bySector: 0,
      byValuation: 0,
      total: 0
    },
    name: core.name || core.ticker,
    ticker: core.ticker
  } as CompanyStock;

  return mergeDeepLeft(core, empty) as T & CompanyStock;
};