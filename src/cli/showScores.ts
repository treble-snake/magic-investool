import {run} from './run';
import {readState, writeState} from '../magic-formula/storage/state';
import {CompanyWithAnalytics, CoreCompany} from '../common/companies';
import {indexBy, omit, pick, prop, reverse} from 'ramda';
import {readPortfolio} from '../portfoio/readPortfolio';

const indexByScore = (
  companies: CompanyWithAnalytics[],
  scoreFn: (it: CompanyWithAnalytics) => number) => {

  return companies
    .sort((a, b) => scoreFn(a) > scoreFn(b) ? 1 : -1)
    .reduce((acc, it, index) => {
      acc[it.ticker] = index + 1;
      return acc;
    }, {} as Record<string, number>);
};

run(async () => {
  const companies = await readState();
  const portfolio = await readPortfolio();
  const ownedCompanies = indexBy(prop('ticker'), portfolio);

  const bySector = indexByScore(companies, it => it.sectorScore);
  const byRevenue = indexByScore(companies, it => it.revenue.score);
  const byRecommendation = indexByScore(companies, it => it.recommendation.score);
  const byValuation = indexByScore(companies, it => it.valuation.score);

  const rankedCompanies = companies
    .filter(it => !ownedCompanies[it.ticker])
    .map(it => {
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
    })
    .sort((a, b) => a.rank.total > b.rank.total ? -1 : 1);

  console.warn(rankedCompanies.map(it => `${it.name} (${it.sector})`));

  await writeState(
    rankedCompanies.map(it => {
      const result: any = omit(['rawFinancialData', 'revenue'], it);
      result.revenueStr = {
        ...it.revenue,
        data: reverse(it.revenue.data).map(it => `${it.valueStr ?? '?'} (${it.date})`).join(' → ')
      };

      return result;
    }),
    '_persistance_/storage/ranked.json');
});


// let currentPlace = 1;
// let prevScore = sorted[0].sectorScore;
// const places: Record<string, number> = {};
//
// for (const it of sorted) {
//   if (it.sectorScore > prevScore) {
//     prevScore = it.sectorScore;
//     currentPlace++;
//   }
//
//   places[it.ticker] = currentPlace;
//     console.warn(
//       it.ticker,
//       it.sector,
//       it.sectorScore,
//       currentPlace
//     );
// }