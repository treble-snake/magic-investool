import {login} from './data-source/methods/login';
import {AUTH_EMAIL, AUTH_PASSWORD} from './data-source/config';
import {getCompanies} from './data-source/methods/getCompanies';
import {parseHtml} from './data-source/helpers/parseHtml';
import {readMfState, writeMfState} from './storage/mfStorage';
import {compareState} from './utils/compareState';
import {logger} from '../common/logging/logger';
import {creatReport} from './utils/creatReport';
import {enrichCompany} from '../enrichment/enrichCompany';
import {CompanyStock} from '../common/companies';
import {indexBy, prop} from 'ramda';
import {calculateScores} from '../evaluation/calculateScores';
import {readPortfolio} from '../portfoio/portfolioStorage';

const getNewItems = async () => {
  const token = await login(AUTH_EMAIL, AUTH_PASSWORD);
  const html = await getCompanies(token);
  return parseHtml(html);
};

export const refreshMagicFormulaData = async () => {
  const [items, state] = await Promise.all([getNewItems(), readMfState()]);
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
        return enrichCompany(it);
      }

      return it as CompanyStock;
    })
  );

  logger.info('Calculating scores');
  await writeMfState(calculateScores(enrichedCompanies, await readPortfolio()));
};