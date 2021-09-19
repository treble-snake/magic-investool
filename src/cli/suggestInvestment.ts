import {run} from './utils/run';
import {filePortfolioStorage} from '../portfoio/storage/FilePortfolioStorage';
import {findOverdueItems} from '../portfoio/findOverdueItems';
import {identity, indexBy, prop} from 'ramda';
import {calculateScores} from '../evaluation/calculateScores';
import {JsonFileStorage} from '../storage/file';
import {rankCompanies} from '../evaluation/rankCompanies';
import {logger} from '../common/logging/logger';
import {replaceRevenue} from './utils/replaceRevenue';
import {CompanyStock} from '../common/types/companies.types';
import {enrichCompany} from '../enrichment/enrichCompany';
import {format} from 'date-fns';
import {fileMagicFormulaStorage} from '../magic-formula/storage/FileMagicFormulaStorage';

const storage = new JsonFileStorage<any>('_persistance_/storage/rankedPortfolio.json');

const enrichAll = async (companies: CompanyStock[]) => {
  if (companies.length <= 1) {
    return companies;
  }

  return Promise.all(companies.map(it => enrichCompany(it)));
};

run(async () => {
  const date = process.env.DATE ? new Date(process.env.DATE) : new Date();
  // TODO: save force enrichments to portfolio
  const forceUpdate = process.env.FORCE_UPD === 'true' || process.env.FORCE_UPD === '1';
  const prepareOverdue = forceUpdate ? enrichAll : identity;

  const [portfolio, mfState] = await Promise.all([
    filePortfolioStorage().findAll(),
    fileMagicFormulaStorage().findAll()
  ]);
  const magicByTicker = indexBy(prop('ticker'), mfState);

  const overdue = await prepareOverdue(findOverdueItems(portfolio, date));

  const itemsToBuyMore = rankCompanies(calculateScores(
    overdue.filter(it => magicByTicker[it.ticker]), portfolio))
    .sort((a, b) => - a.rank.total + b.rank.total)
    .map(replaceRevenue);

  const itemsToBuyByTicker = indexBy(prop('ticker'), itemsToBuyMore);
  const itemsToSell = rankCompanies(calculateScores(
    overdue.filter(it => !itemsToBuyByTicker[it.ticker]), portfolio))
    .sort((a, b) => a.rank.total - b.rank.total)
    .map(replaceRevenue);

  logger.info(`Suggestions for ${format(date, 'MMMM')}`);
  if (itemsToBuyMore.length > 0) {
    logger.info(`You can buy more of ${itemsToBuyMore.map(prop('name'))}`);
  }

  if (itemsToSell.length > 0) {
    logger.info(`You can sell: ${itemsToSell.map(prop('name'))}`);
  }

  if (itemsToSell.length + itemsToBuyMore.length === 0) {
    logger.info('Looks like there is no action this month');
  }

  await storage.write({itemsToBuyMore, itemsToSell});
});