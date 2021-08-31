import {logger} from '../common/logging/logger';
import {readState, writeState} from '../magic-formula/storage/state';
import {enrichCompany} from './enrichCompany';
import {MagicCompany} from '../common/companies';

const ARG_TICKER = process.env.TICKER;

const enrichInState = async (ticker: string, state: MagicCompany[]) => {
  const item = state.find(it => it.ticker === ticker);
  if (!item) {
    logger.warn(`${ticker} not found`);
    return state;
  }

  logger.info(`Enriching ${ticker}`);
  const enriched = await enrichCompany(item);
  return state
    .filter(it => it.ticker !== ticker)
    .concat(enriched)
    .sort((a, b) => a.ticker > b.ticker ? 1 : -1);
};

const run = async () => {
  const state = await readState();
  let newState = state;

  if (ARG_TICKER) {
    newState = await enrichInState(ARG_TICKER, newState);
  } else {
    for (const company of state) {
      newState = await enrichInState(company.ticker, newState);
    }
  }

  await writeState(newState);
};

run()
  .then(() => process.exit(0))
  .catch((e) => {
    logger.error(e);
    process.exit(1);
  });