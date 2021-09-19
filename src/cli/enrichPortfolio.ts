import {run} from './utils/run';
import {enrichOutdated} from '../enrichment/enrichOutdated';
import {readPortfolio, writePortfolio} from '../portfoio/portfolioStorage';
import {CompanyStock} from '../common/types/companies.types';


run(async () => {
  throw new Error('Not implemented')
  // const state = await readPortfolio();
  // const enriched = await enrichOutdated(state, 30);
  // await writePortfolio(enriched);
});