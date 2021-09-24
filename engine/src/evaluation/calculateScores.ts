import {CompanyStock, PortfolioCompany} from '../common/types/companies.types';
import {getPortfolioSectors, scoreSector} from './scoreSector';
import {scoreRevenue} from './scoreRevenue';
import {scoreValuation} from './scoreValuation';
import {scoreRecommendation} from './scoreRecommendation';
import {memoizeWith} from 'ramda';

const memoSectors = memoizeWith(JSON.stringify, getPortfolioSectors);

// TODO: mutating companies :(
export const calculateScores = (
  companies: CompanyStock[],
  portfolio: PortfolioCompany[]) => {

  return companies.map(it => {
    it.sectorScore = scoreSector(it.sector, memoSectors(portfolio));
    it.revenue.score = scoreRevenue(it.revenue.data);
    it.valuation.score = scoreValuation(it.valuation.data);
    it.recommendation.score = scoreRecommendation(it.recommendation.data);

    return it;
  });
};