import {login} from './data-source/methods/login';
import {getCompanies} from './data-source/methods/getCompanies';
import {parseHtml} from './data-source/helpers/parseHtml';
import {compareState} from './utils/compareState';
import {logger} from '../common/logging/logger';
import {CompanyStock} from '../common/types/companies.types';
import {indexBy, prop, sortBy} from 'ramda';
import {AppContext} from '../context/context';
import {enrichmentOperations} from '../enrichment/operations';
import {isAfter} from 'date-fns';

const getNewItems = async (mfLogin: string, mfPassword: string) => {
  const token = await login(mfLogin, mfPassword);
  const html = await getCompanies(token);
  return parseHtml(html);
};

export const magicFormulaOperations = (context: AppContext) => ({
  async refresh() {
    const {mfStorage, userAccountStorage} = context;
    const {
      magicFormulaLogin,
      magicFormulaPassword
    } = await userAccountStorage.getAccountData();

    const [items, state] = await Promise.all([
      getNewItems(magicFormulaLogin, magicFormulaPassword),
      mfStorage.findAll()
    ]);
    const changes = compareState(state, items);

    if (changes.removed.length + changes.added.length === 0) {
      logger.info('Nothing changed in MF');
      return;
    }

    logger.info('Changes detected, making updates');
    // save changelog in the background
    context.mfChangelogStorage.add(changes)
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
  },
  async cleanup(limit = 0) {
    if (limit <= 0) {
      return context.mfChangelogStorage.save([]);
    }
    const entries = await context.mfChangelogStorage.findAll();
    const length = entries.length;
    return context.mfChangelogStorage.save(
      sortBy(prop('date'), entries).slice(length - limit, length));
  }
});
