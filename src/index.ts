import {AUTH_EMAIL, AUTH_PASSWORD} from './data-source/magic-formula/env.config';
import {readState, writeState} from './storage/state';
import {compareState} from './magic-formula/compareState';
import {creatReport} from './magic-formula/creatReport';
import {login} from './data-source/magic-formula/methods/login';
import {getCompanies} from './data-source/magic-formula/methods/getCompanies';
import {parseHtml} from './data-source/magic-formula/helpers/parseHtml';
import {logger} from './common/logging/logger';

export const run = () => login(AUTH_EMAIL, AUTH_PASSWORD)
  .then(token => getCompanies(token))
  .then(html => parseHtml(html))
  .then(async (items) => {
    const state = await readState();
    const changes = compareState(state, items);

    if (changes.removed.length + changes.added.length === 0) {
      logger.log('Nothing changed');
    } else {
      logger.log('Changes detected, updating state');
      await creatReport(changes);
      return writeState(items);
    }
  })
  .then(() => process.exit(0))
  .catch((e) => {
    logger.error(e);
    process.exit(1);
  });

run();