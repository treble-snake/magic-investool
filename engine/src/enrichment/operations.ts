import {AppContext} from '../context/context';
import {CompanyStock, CoreCompany} from '../common/types/companies.types';
import {enrichCompanyWithYahoo} from './YahooHelpers';
import {logger} from '../common/logging/logger';
import {makeEmptyCompany} from './makeEmptyCompany';
import {differenceInHours} from 'date-fns';
import {getCompanyData} from './yahoo/methods/getCompanyData';
import {getInsightData} from './yahoo/methods/getInsightData';

const getTimestamp = (company: CompanyStock) => {
  if ('lastUpdated' in company && company.lastUpdated) {
    return new Date(company.lastUpdated).getTime();
  }

  return 0;
};

const fetchData = async (ticker: string, context: AppContext) => {
  logger.info(`Enriching ${ticker}`);

  const cached = await context.yahooCache.get(ticker);
  if (cached) {
    const cacheAge = differenceInHours(new Date(), new Date(cached.lastUpdated));
    if (cacheAge <= context.config.FINANCE_CACHE_THRESHOLD_HRS) {
      logger.debug(`Using fresh enough (${cacheAge}h) cache values for ${ticker}`);
      return cached;
    }
  }

  // TODO: don't fail all if only 1 req failed
  // TODO: decouple API data source, read from context
  const [basic, insights] = await Promise.all([
    getCompanyData(ticker),
    getInsightData(ticker)
  ]);

  const result = {basic, insights, lastUpdated: new Date().toISOString()};
  context.yahooCache
    .set(ticker, result)
    .catch(e => console.warn(`Failed to write to cache for ${ticker}`, e));

  return result;
};

export const enrichmentOperations = (context: AppContext) => ({
  /**
   * Best effort update, should not throw
   */
  async enrichCompany(company: Partial<CoreCompany> & Pick<CoreCompany, 'ticker'>) {
    if (!company.ticker) {
      throw new Error('Given company does not have a ticker');
    }

    // TODO: cache gets called twice (1st time in fetchData())
    const data = await fetchData(company.ticker, context)
      .catch(e => context.yahooCache.get(company.ticker));

    if (data) {
      return {
        ...makeEmptyCompany(company),
        ...enrichCompanyWithYahoo(data.basic, data.insights),
        lastUpdated: data.lastUpdated
      };
    }

    return makeEmptyCompany(company);

  },
  async enrichOutdated(current: CompanyStock[], batchSize = 5) {
    logger.info(`Enriching max ${batchSize} outdated companies`);

    const toEnrich = [...current]
      .sort((a, b) => getTimestamp(a) - getTimestamp(b))
      .slice(0, batchSize)
      .map(it => it.ticker);
    logger.debug(`To enrich: ${toEnrich}`);

    return Promise.all(current.map((company) => {
      if (!toEnrich.includes(company.ticker)) {
        return company;
      }

      return this.enrichCompany(company);
    }));
  }
});