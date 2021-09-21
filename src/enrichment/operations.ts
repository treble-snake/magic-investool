import {AppContext} from '../context/context';
import {CompanyStock, CoreCompany} from '../common/types/companies.types';
import {enrichCompany} from './enrichCompany';
import {logger} from '../common/logging/logger';

const getTimestamp = (company: CompanyStock) => {
  if ('lastUpdated' in company && company.lastUpdated) {
    return new Date(company.lastUpdated).getTime();
  }

  return 0;
}

export const enrichmentOperations = (context: AppContext) => ({
  enrichCompany(company: CoreCompany) {
    return enrichCompany(company, context);
  },
  async enrichOutdated(current: CompanyStock[], batchSize = 5) {
  logger.info(`Enriching max ${batchSize} outdated companies`);

  const toEnrich = [...current]
    .sort((a, b) => getTimestamp(a) - getTimestamp(b))
    .slice(0, batchSize)
    .map(it => it.ticker);
  logger.debug(`To enrich: ${toEnrich}`);

  // todo: check not today
  return Promise.all(current.map((company) => {
    if (!toEnrich.includes(company.ticker)) {
      return company;
    }

    return this.enrichCompany(company);
  }));
}
});