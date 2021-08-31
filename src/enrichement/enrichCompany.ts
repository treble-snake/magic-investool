import {MagicCompany} from '../common/companies';
import {getCompanyData} from './yahoo/methods/getCompanyData';
import {getInsightData} from './yahoo/methods/getInsightData';
import {logger} from '../common/logging/logger';

export const enrichCompany = async (company: MagicCompany): Promise<MagicCompany> => {
  if (!company.ticker) {
    throw new Error('No ticker found for given company');
  }

  // TODO: move to higher level?
  if (company.rawFinancialData?.yahoo) {
    logger.info(`${company.ticker} already has Yahoo data`);
    return company;
  }

  const [basic, insights] = await Promise.all([
    getCompanyData(company.ticker),
    getInsightData(company.ticker)
  ]);

  return {
    ...company,
    rawFinancialData: {
      yahoo: {basic, insights}
    }
  }
}