import {logger} from '../common/logging/logger';
import {enrichCompany} from './enrichCompany';
import {Company, CompanyWithAnalytics, CoreCompany} from '../common/companies';

export const enrichAllMissing = async (state: Array<CoreCompany|Company|CompanyWithAnalytics>) => {
  logger.info('Enriching all companies without financial data');

  return Promise.all(state.map((company) => {
    if ('rawFinancialData' in company && company.rawFinancialData?.yahoo) {
      logger.debug(`Skipping ${company.ticker}`);
      return company;
    }

    logger.debug(`Enriching ${company.ticker}...`);
    return enrichCompany(company);
  }));
}