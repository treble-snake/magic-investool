import {run} from './run';
import {readState, writeState} from '../magic-formula/storage/mfStorage';
import {getPortfolioSectors, scoreSector} from '../scores/scoreSector';
import {scoreValuation} from '../scores/scoreValuation';
import {scoreRecommendation} from '../scores/scoreRecommendation';
import {scoreRevenue} from '../scores/scoreRevenue';
import {readPortfolio} from '../portfoio/portfolioStorage';
import {omit} from 'ramda';
import {CompanyWithAnalytics} from '../common/companies';

run(async () => {
  const companies = await readState();
  const sectors = getPortfolioSectors(await readPortfolio());

  const newState = (companies as CompanyWithAnalytics[]).map(it => {
    // console.warn(omit(['rawFinancialData'], it));

    it.sectorScore = scoreSector(it.sector, sectors);
    it.revenue.score = scoreRevenue(it.revenue.data);
    it.valuation.score = scoreValuation(it.valuation.data);
    it.recommendation.score = scoreRecommendation(it.recommendation.data);

    return it;
  });

  await writeState(newState);
});