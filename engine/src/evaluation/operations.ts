import {AppContext} from '../context/context';
import {CompanyStock} from '../common/types/companies.types';
import {scoreSector} from './scores/scoreSector';
import {scoreRevenue} from './scores/scoreRevenue';
import {scoreValuation} from './scores/scoreValuation';
import {scoreRecommendation} from './scores/scoreRecommendation';
import {portfolioOperations, SectorQty} from '../portfoio/operations';
import {identity, indexBy, mapObjIndexed, prop, sum} from 'ramda';
import {rankCompanies} from './rankCompanies';
import {findOverdueItems} from '../portfoio/findOverdueItems';
import {replaceRevenue} from '../cli/utils/replaceRevenue';
import {logger} from '../common/logging/logger';
import {format} from 'date-fns';

export const rankOperations = (context: AppContext) => ({
  async scoreAndRank(companies: CompanyStock[]) {
    const sectors = await portfolioOperations(context).getSectors();
    const sectorsTotal = sum(sectors.map(prop('qty')));
    const sectorPercentage = mapObjIndexed(
      (x: SectorQty) => Math.round(100 * 100 * x.qty / sectorsTotal) / 100,
      indexBy(prop('name'), sectors)
    );

    const withScores = companies.map(it => {
      const scored = {...it};
      scored.sectorScore = scoreSector(it.sector, sectorPercentage);
      scored.revenue.score = scoreRevenue(it.revenue.data);
      scored.valuation.score = scoreValuation(it.valuation.data);
      scored.recommendation.score = scoreRecommendation(it.recommendation.data);

      return scored;
    });

    return rankCompanies(withScores);
  },
  async makeSuggestion(customDate?: string) {
    const date = customDate ? new Date(customDate) : new Date();
    const [portfolio, mfState] = await Promise.all([
      context.portfolioStorage.findAll(),
      context.mfStorage.findAll()
    ]);

    const magicByTicker = indexBy(prop('ticker'), mfState);
    const overdue = findOverdueItems(portfolio, date);
    const toBuyMore = (
      await this.scoreAndRank(overdue.filter(it => magicByTicker[it.ticker]))
    ).sort((a, b) => -a.rank.total + b.rank.total);

    const toBuyByTicker = indexBy(prop('ticker'), toBuyMore);
    const toSell = (
      await this.scoreAndRank(overdue.filter(it => !toBuyByTicker[it.ticker]))
    ).sort((a, b) => a.rank.total - b.rank.total);


    let toBuy: CompanyStock[] = [];
    if (toSell.length > 0) {
      const portfolioByTicker = indexBy(prop('ticker'), portfolio);
      toBuy = mfState
        .filter(it => !portfolioByTicker[it.ticker])
        .sort((a, b) => a.rank.total - b.rank.total)
        .slice(0, toSell.length * 2)
    }

    return {toBuyMore, toBuy, toSell}
  }
});