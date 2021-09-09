import {run} from './run';
import {enrichOutdated} from '../enrichement/enrichOutdated';
import {readPortfolio, writePortfolio} from '../portfoio/portfolioStorage';
import {CompanyWithAnalytics} from '../common/companies';


run(async () => {
  const state = await readPortfolio();
  const enriched = await enrichOutdated(state, 30);
  await writePortfolio(enriched as CompanyWithAnalytics[]);
});