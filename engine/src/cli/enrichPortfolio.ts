import {run} from './utils/run';
import {PortfolioCompany} from '../common/types/companies.types';
import {defaultContext} from '../context/context';
import {enrichmentOperations} from '../enrichment/operations';


run(async () => {
  throw new Error('Not implemented')
  const context = defaultContext();
  const state = await context.portfolioStorage.findAll();
  const enriched = await enrichmentOperations(context).enrichOutdated(state, 30);
  await context.portfolioStorage.save(enriched as PortfolioCompany[]);
});