import {login} from './data-source/methods/login';
import {MF_AUTH_EMAIL, MF_AUTH_PASSWORD} from './data-source/config';
import {getCompanies} from './data-source/methods/getCompanies';
import {parseHtml} from './data-source/helpers/parseHtml';
import {compareState} from './utils/compareState';
import {logger} from '../common/logging/logger';
import {CompanyStock} from '../common/types/companies.types';
import {indexBy, prop} from 'ramda';
import {AppContext} from '../context/context';
import {enrichmentOperations} from '../enrichment/operations';
import {isAfter} from 'date-fns';

const getNewItems = async () => {
  const token = await login(MF_AUTH_EMAIL, MF_AUTH_PASSWORD);
  const html = await getCompanies(token);
  return parseHtml(html);
};

export const magicFormulaOperations = (context: AppContext) => ({
  async refresh() {
    const {mfStorage} = context;
    const [items, state] = await Promise.all([getNewItems(), mfStorage.findAll()]);
    const changes = compareState(state, items);

    if (changes.removed.length + changes.added.length === 0) {
      logger.info('Nothing changed in MF');
      return;
    }

    logger.info('Changes detected, making updates');
    // save changelog in the background
    context.mfChangelogStorage.save(changes)
      .catch(e => logger.warn('Failed to write changelog', e));

    logger.info('Fetching financial data');
    const enrichmentOps = enrichmentOperations(context);
    const addedByTicker = indexBy(prop('ticker'), changes.added);
    const enrichedCompanies = await Promise.all(changes.combined.map((it) => {
        if (addedByTicker[it.ticker]) {
          return enrichmentOps.enrichCompany(it);
        }

        return it as CompanyStock;
      })
    );

    logger.info('Calculating scores and ranks');
    await mfStorage.save(enrichedCompanies);
  },
  async updateAll() {
    const {mfStorage} = context;
    const state = await mfStorage.findAll();

    logger.info('Fetching financial data');
    const enrichmentOps = enrichmentOperations(context);
    const enrichedCompanies = await Promise.all(
      state.map((it) => enrichmentOps.enrichCompany(it)));

    await mfStorage.save(enrichedCompanies);
  },
  async getUnseenChanges(thresholdSec = 0) {
    const [entries, {prev, current}] = await Promise.all([
      context.mfChangelogStorage.findAll(),
      context.mfChangelogStorage.lastSeenAt()
    ]);

    const shouldBeAfter = current.getTime() + thresholdSec * 1000 > Date.now() ?
      prev :
      current;
    return entries.filter(it => isAfter(new Date(it.date), shouldBeAfter));
  }
});
