import {CompanyStock} from '../common/types/companies.types';
import {comparator} from 'ramda';

const indexByScore = (
  companies: CompanyStock[],
  scoreFn: (it: CompanyStock) => number) => {
  return companies
    // the bigger score is the better
    .sort(comparator((a, b) => scoreFn(a) > scoreFn(b)))
    .reduce((acc, it, index) => {
      acc[it.ticker] = index + 1;
      return acc;
    }, {} as Record<string, number>);
};

export const rankCompanies =<T extends CompanyStock> (companies: T[]): T[] => {
  const bySector = indexByScore(companies, it => it.sectorScore);
  const byRevenue = indexByScore(companies, it => it.revenue.score);
  const byRecommendation = indexByScore(companies, it => it.recommendation.score);
  const byPrice = indexByScore(companies, it => it.prices.score);

  // the smaller the rank is the better
  return companies.map(it => {
    return {
      ...it,
      rank: {
        bySector: bySector[it.ticker],
        byRevenue: byRevenue[it.ticker],
        byRecommendation: byRecommendation[it.ticker],
        byPrice: byPrice[it.ticker],
        total: bySector[it.ticker] + byRevenue[it.ticker] + byRecommendation[it.ticker] + byPrice[it.ticker]
      }
    };
  });
};
