import {login} from './data-source/methods/login';
import {
  AUTH_EMAIL,
  AUTH_PASSWORD
} from './data-source/env.config';
import {getCompanies} from './data-source/methods/getCompanies';
import {parseHtml} from './data-source/helpers/parseHtml';
import {readState, writeState} from './storage/mfStorage';
import {compareState} from './utils/compareState';
import {logger} from '../common/logging/logger';
import {creatReport} from './utils/creatReport';
import {enrichAllMissing} from '../enrichement/enrichAllMissing';
import {enrichOutdated} from '../enrichement/enrichOutdated';

const getNewItems = async () => {
  const token = await login(AUTH_EMAIL, AUTH_PASSWORD);
  const html = await getCompanies(token);
  return parseHtml(html);
};

// TODO: do just MF here
export const syncMagicFormula = async () => {
  const [items, state] = await Promise.all([getNewItems(), readState()]);
  const changes = compareState(state, items);

  if (changes.removed.length + changes.added.length === 0) {
    logger.info('Nothing changed in MF');
  } else {
    logger.info('Changes detected, updating state');
    await creatReport(changes);
    try {
      await writeState(await enrichAllMissing(changes.combined));
    } catch (e) {
      logger.warn('Enrichment failed: ', e);
      await writeState(changes.combined);
    }
  }

  // todo: this is shit
  const newState = await readState();
  return writeState(await enrichOutdated(newState, 5));
};