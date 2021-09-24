import {CompanyStock} from '../common/types/companies.types';

const indexByScore = (
  companies: CompanyStock[],
  scoreFn: (it: CompanyStock) => number) => {
  return companies
    .sort((a, b) => scoreFn(a) > scoreFn(b) ? 1 : -1)
    .reduce((acc, it, index) => {
      acc[it.ticker] = index + 1;
      return acc;
    }, {} as Record<string, number>);
};

export const rankCompanies = (companies: CompanyStock[]): CompanyStock[] => {
  const bySector = indexByScore(companies, it => it.sectorScore);
  const byRevenue = indexByScore(companies, it => it.revenue.score);
  const byRecommendation = indexByScore(companies, it => it.recommendation.score);
  const byValuation = indexByScore(companies, it => it.valuation.score);

  return companies.map(it => {
    return {
      ...it,
      rank: {
        bySector: bySector[it.ticker],
        byRevenue: byRevenue[it.ticker],
        byRecommendation: byRecommendation[it.ticker],
        byValuation: byValuation[it.ticker],
        total: bySector[it.ticker] + byRevenue[it.ticker] + byRecommendation[it.ticker] + byValuation[it.ticker]
      }
    };
  });
};
