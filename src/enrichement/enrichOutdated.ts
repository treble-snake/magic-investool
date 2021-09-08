import {logger} from '../common/logging/logger';
import {enrichCompany} from './enrichCompany';
import {CompanyWithAnalytics, CoreCompany} from '../common/companies';

const getTimestamp = (company: CompanyWithAnalytics | CoreCompany) => {
  if ('lastUpdated' in company && company.lastUpdated) {
    return new Date(company.lastUpdated).getTime();
  }

  return 0;
}

export const enrichOutdated = async (state: CompanyWithAnalytics[] | CoreCompany[], batchSize = 5) => {
  logger.info(`Enriching max ${batchSize} outdated companies`);

  const toEnrich = [...state]
    .sort((a, b) => getTimestamp(a) - getTimestamp(b))
    .slice(0, batchSize)
    .map(it => it.ticker);
  logger.debug(`To enrich: ${toEnrich}`);

  // todo: check not today
  return Promise.all(state.map((company) => {
    if (!toEnrich.includes(company.ticker)) {
      return company;
    }

    return enrichCompany(company);
  }));
}