import {run} from './utils/run';
import {prop} from 'ramda';
import {JsonFileStorage} from '../storage/file';
import {logger} from '../common/logging/logger';
import {defaultContext} from '../context/context';
import {rankOperations} from '../evaluation/operations';

const storage = new JsonFileStorage<any>('_persistance_/storage/tmp/suggestions.json');

// const enrichAll = (context: AppContext) => async (companies: CompanyStock[]) => {
//   if (companies.length <= 1) {
//     return companies;
//   }
//
//   return Promise.all(companies.map(
//     it => enrichmentOperations(context).enrichCompany(it)));
// };

run(async () => {
  const context = defaultContext();

  // TODO: reimplement force update if needed and save force enrichments to portfolio
  // const forceUpdate = process.env.FORCE_UPD === 'true' || process.env.FORCE_UPD === '1';
  // const prepareOverdue = forceUpdate ? enrichAll(context) : identity;
  const {toSell, toBuy, toBuyMore} = await rankOperations(context)
    .makeSuggestion({customDate: process.env.DATE})

  logger.info(`Suggestions:`);
  if (toBuy.length > 0) {
    logger.info(`You can buy more of ${toBuy.map(prop('name'))}`);
  }

  if (toSell.length > 0) {
    logger.info(`You can sell: ${toSell.map(prop('name'))}`);
  }

  if (toSell.length + toBuy.length === 0) {
    logger.info('Looks like there is no action this month');
  }

  await storage.write({toBuy, toSell, toBuyMore});
});