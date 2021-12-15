import {AppContext} from '../context/context';
import {CompanyStock, CoreCompany} from '../common/types/companies.types';
import {enrichCompanyWithYahoo} from './YahooHelpers';
import {logger} from '../common/logging/logger';
import {EnrichableCompany, makeEmptyCompany} from './makeEmptyCompany';
import {differenceInHours} from 'date-fns';
import {yahooApi} from './yahoo/yahooApi';

const getTimestamp = (company: CompanyStock) => {
  if ('lastUpdated' in company && company.lastUpdated) {
    return new Date(company.lastUpdated).getTime();
  }

  return 0;
};

const fetchData = async (ticker: string, forceUpdate: boolean, context: AppContext) => {
  logger.info(`Enriching ${ticker}`);

  if (!forceUpdate) {
    const cached = await context.yahooCache.get(ticker);
    if (cached) {
      const cacheAge = differenceInHours(new Date(), new Date(cached.lastUpdated));
      const threshold = await context.userAccountStorage.getAccountData()
        .then(it => it.yahooCacheThreshold);
      if (cacheAge <= threshold) {
        logger.debug(`Using fresh enough (${cacheAge}h) cache values for ${ticker}`);
        return cached;
      }
    }
    logger.debug(`Couldn\'t find info in the cache for ${ticker}`);
  }

  // TODO: don't fail all if only 1 req failed
  // TODO: decouple API data source, read from context
  const api = yahooApi(context);
  const [basic, insights] = await Promise.all([
    api.getCompanyData(ticker),
    api.getInsightData(ticker)
  ]);

  const result = {basic, insights, lastUpdated: new Date().toISOString()};
  context.yahooCache
    .set(ticker, result)
    .then(() => logger.info(`Cache updated for ${ticker}`))
    .catch(e => logger.warn(`Failed to write to cache for ${ticker}`, e));

  return result;
};

export const enrichmentOperations = (context: AppContext) => ({
  /**
   * Best effort update, should not throw
   * @param company - at least ticker should be defined
   * @param forceUpdate - tries to get frmo cache first if false, skips cache check if true
   */
  async enrichCompany <T extends EnrichableCompany> (
    company: T,
    forceUpdate = false
  ) {
    if (!company.ticker) {
      throw new Error(`Given company (${company.name}) does not have a ticker`);
    }

    // TODO: cache gets called twice (1st time in fetchData())
    const data = await fetchData(company.ticker, forceUpdate, context)
      .catch(e => {
        logger.warn(`Unable to get data for ${company.ticker}, fallback to cache.`, e);
        return context.yahooCache.get(company.ticker)
      });

    if (data) {
      return {
        ...makeEmptyCompany(company),
        ...enrichCompanyWithYahoo(data.basic, data.insights),
        lastUpdated: data.lastUpdated
      };
    }

    logger.warn(`No data were found for ${company.ticker}, fallback to empty`);
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