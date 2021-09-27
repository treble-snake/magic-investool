import {login} from './data-source/methods/login';
import {AUTH_EMAIL, AUTH_PASSWORD} from './data-source/config';
import {getCompanies} from './data-source/methods/getCompanies';
import {parseHtml} from './data-source/helpers/parseHtml';
import {compareState} from './utils/compareState';
import {logger} from '../common/logging/logger';
import {creatReport} from './utils/creatReport';
import {CompanyStock} from '../common/types/companies.types';
import {indexBy, prop} from 'ramda';
import {AppContext} from '../context/context';
import {enrichmentOperations} from '../enrichment/operations';
import {rankOperations} from '../evaluation/operations';

const getNewItems = async () => {
  const token = await login(AUTH_EMAIL, AUTH_PASSWORD);
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
    // report in the background
    creatReport(changes)
      .catch(e => logger.warn('Failed to create a report', e));

    logger.info('Fetching financial data');
    const addedByTicker = indexBy(prop('ticker'), changes.added);
    const enrichedCompanies = await Promise.all(changes.combined.map((it) => {
        if (addedByTicker[it.ticker]) {
          return enrichmentOperations(context).enrichCompany(it);
        }

        return it as CompanyStock;
      })
    );

    logger.info('Calculating scores and ranks');
    const ranked = await rankOperations(context).scoreAndRank(enrichedCompanies);
    await mfStorage.save(ranked);
  }
});