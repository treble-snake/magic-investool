import {logger} from '../common/logging/logger';
import {enrichCompany} from './enrichCompany';
import {CompanyStock} from '../common/types/companies.types';

const getTimestamp = (company: CompanyStock) => {
  if ('lastUpdated' in company && company.lastUpdated) {
    return new Date(company.lastUpdated).getTime();
  }

  return 0;
}

export const enrichOutdated = async (current: CompanyStock[], batchSize = 5) => {
  logger.info(`Enriching max ${batchSize} outdated companies`);

  const toEnrich = [...current]
    .sort((a, b) => getTimestamp(a) - getTimestamp(b))
    .slice(0, batchSize)
    .map(it => it.ticker);
  logger.debug(`To enrich: ${toEnrich}`);

  // todo: check not today
  // todo: don't fail all if one fails
  return Promise.all(current.map((company) => {
    if (!toEnrich.includes(company.ticker)) {
      return company;
    }

    return enrichCompany(company);
  }));
}