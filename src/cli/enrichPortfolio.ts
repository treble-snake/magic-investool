import {run} from './utils/run';
import {enrichOutdated} from '../enrichment/enrichOutdated';
import {filePortfolioStorage} from '../portfoio/storage/FilePortfolioStorage';
import {PortfolioCompany} from '../common/types/companies.types';


run(async () => {
  throw new Error('Not implemented')
  const storage = filePortfolioStorage();
  const state = await storage.findAll();
  const enriched = await enrichOutdated(state, 30);
  await storage.save(enriched as PortfolioCompany[]);
});