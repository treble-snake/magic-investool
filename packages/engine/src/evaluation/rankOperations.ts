import {AppContext} from '../context/context';
import {CompanyStock} from '../common/types/companies.types';
import {scoreSector} from './scores/scoreSector';
import {scoreRevenue} from './scores/scoreRevenue';
import {scorePrice} from './scores/scorePrice';
import {scoreRecommendation} from './scores/scoreRecommendation';
import {portfolioOperations, SectorQty} from '../portfoio/portfolioOperations';
import {comparator, indexBy, mapObjIndexed, prop, sum} from 'ramda';
import {rankCompanies} from './rankCompanies';
import {findOverdueItems} from '../portfoio/findOverdueItems';

const DEFAULT_BUY_SIZE = 6;

export const rankOperations = (context: AppContext) => ({
  async scoreAndRank<T extends CompanyStock>(companies: T[]): Promise<T[]> {
    // TODO: sectors are user-specific, must be an input argument
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
      scored.prices.score = scorePrice(it);
      scored.recommendation.score = scoreRecommendation(it.recommendation.data);

      return scored;
    });

    return rankCompanies(withScores);
  },
  async makeSuggestion(options: {
    customDate?: string,
    size?: number
  } = {}) {
    const {size, customDate} = options;
    const date = customDate ? new Date(customDate) : new Date();
    const [portfolio, mfState] = await Promise.all([
      context.portfolioStorage.findAll(),
      context.mfStorage.findAll()
    ]);

    const magicByTicker = indexBy(prop('ticker'), mfState);
    const overdue = findOverdueItems(portfolio, date);
    const toBuyMore = (
      await this.scoreAndRank(overdue.filter(it => magicByTicker[it.ticker]))
    ).sort(comparator((a, b) => a.rank.total < b.rank.total))

    const toBuyMoreByTicker = indexBy(prop('ticker'), toBuyMore);
    // reverse order for "sell" items
    const toSell = (
      await this.scoreAndRank(overdue.filter(it => !toBuyMoreByTicker[it.ticker]))
    ).sort(comparator((a, b) => a.rank.total > b.rank.total));


    const portfolioByTicker = indexBy(prop('ticker'), portfolio);
    // ensure we have the latest ranks
    const rankedMgf = await this.scoreAndRank(
      mfState.filter(it => !portfolioByTicker[it.ticker]));
    const toBuy = rankedMgf
      .sort(comparator((a, b) => a.rank.total < b.rank.total))
      .slice(0, size || DEFAULT_BUY_SIZE);

    return {toBuyMore, toBuy, toSell};
  }
});