import {CompanyStock, CoreCompany} from '../common/types/companies.types';
import {
  InsightRecommendationType,
  ValuationType
} from '../common/types/ranking.types';
import {subYears} from 'date-fns';

export type EnrichableCompany =
  Partial<CoreCompany>
  & Pick<CoreCompany, 'ticker'>;

export const makeEmptyCompany = <T extends EnrichableCompany>(core: T): T & CompanyStock => {
  return {
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
    lastUpdated: subYears(new Date(), 1).toISOString(),
    rank: {
      byRecommendation: 0,
      byRevenue: 0,
      bySector: 0,
      byValuation: 0,
      total: 0
    },
    name: core.ticker,
    ...core
  };
};