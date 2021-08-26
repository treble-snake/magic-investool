import {parseHtml} from './data-source/magic-formula/parseHtml';
import {login} from './data-source/magic-formula/rest-api/login';
import {getCompanies} from './data-source/magic-formula/rest-api/getCompanies';
import {AUTH_EMAIL, AUTH_PASSWORD} from './data-source/magic-formula/env.config';
import {readState, writeState} from './storage/state';
import {compareState} from './magic-formula/compareState';
import {creatReport} from './magic-formula/creatReport';

export const run = () => login(AUTH_EMAIL, AUTH_PASSWORD)
  .then(token => getCompanies(token))
  .then(html => parseHtml(html))
  .then(async (items) => {
    const state = await readState();
    // console.log('Current state', state);

    // console.log('New items:', items);
    const changes = compareState(state, items);
    // console.log(changes);

    if (changes.removed.length + changes.added.length === 0) {
      console.log('Nothing changed');
    } else {
      console.log('Changes detected, updating state');
      await creatReport(changes);
      return writeState(items);
    }
  })
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });

run();