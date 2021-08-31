import {logger} from '../common/logging/logger';
import {enrichCompany} from './enrichCompany';
import {MagicCompany} from '../common/companies';

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

// TODO: optimize
export const enrichAllMissing = async (state: MagicCompany[]) => {
  logger.info('Enriching all companies');
  let newState = state;
  for (const company of state) {
    newState = await enrichInState(company.ticker, newState);
  }
  return newState;
}