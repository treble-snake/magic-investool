import {AppContext} from '../context/context';
import {CompanyStock} from '../common/types/companies.types';
import {logger} from '../common/logging/logger';
import {EnrichableCompany, makeEmptyCompany} from './makeEmptyCompany';
import {alphavantageApi} from './alphavantage/alphavantageApi';
import {processRevenue} from './alphavantage/mappers/processRevenue';
import {makeDefaultOverviewCache} from './alphavantage/cache/OverviewCache';
import {makeDefaultIncomeCache} from './alphavantage/cache/IncomeCache';
import {CachedEntity, KeyValueCache} from '../common/types/cache.types';
import {differenceInHours} from 'date-fns';

const getTimestamp = (company: CompanyStock) => {
  if ('lastUpdated' in company && company.lastUpdated) {
    return new Date(company.lastUpdated).getTime();
  }

  return 0;
};

const fetchDataWithCache = async <T>(
  ticker: string,
  operation: string,
  request: () => Promise<T>,
  cache: KeyValueCache<CachedEntity<T>>,
  cacheThreshold: number,
  forceUpdate: boolean
): Promise<CachedEntity<T> | null> => {
  if (!forceUpdate) {
    const cached = await cache.get(ticker);
    if (cached) {
      const cacheAge = differenceInHours(new Date(), new Date(cached.lastUpdated));
      if (cacheAge <= cacheThreshold) {
        logger.debug(`${operation}: Using fresh enough (${cacheAge}h) cache values for ${ticker}`);
        return cached;
      }
    }
    logger.debug(`${operation}: Couldn\'t find info in the cache for ${ticker}`);
  }

  try {
    const data = await request();
    const result = {data, lastUpdated: new Date().toISOString()};
    cache
      .set(ticker, result)
      .then(() => logger.info(`${operation}: Cache updated for ${ticker}`))
      .catch(e => logger.warn(`${operation}: Failed to write to cache for ${ticker}`, e));

    return result;
  } catch (e) {
    logger.warn(`${operation}: Couldn't fetch data for ${ticker}, fallback to cache`, e)
    return cache.get(ticker);
  }
};

export const enrichmentOperations = (context: AppContext) => ({
  /**
   * Best effort update, should not throw
   * @param company - at least ticker should be defined
   * @param forceUpdate - tries to get frmo cache first if false, skips cache check if true
   */
  async enrichCompany<T extends EnrichableCompany>(
    company: T,
    forceUpdate = false
  ) {
    if (!company.ticker) {
      throw new Error(`Given company (${company.name}) does not have a ticker`);
    }

    try {
      // TODO: move cache to the context? api to the context?
      const alphaVantageApi = alphavantageApi(context);
      const overview = await fetchDataWithCache(
        company.ticker,
        'overview',
        () => alphaVantageApi.getCompanyOverview(company.ticker),
        makeDefaultOverviewCache(),
        24,
        forceUpdate
      );
      const income = await fetchDataWithCache(
        company.ticker,
        'income',
        () => alphaVantageApi.getIncomeStatement(company.ticker),
        makeDefaultIncomeCache(),
        24 * 30,
        forceUpdate
      );

      const result = makeEmptyCompany(company);

      if (overview) {
        result.name = overview.data.Name;
        result.sector = overview.data.Sector;
        result.overview = {
          peRatio: Number.parseFloat(overview.data.PERatio),
          marketCap: Number.parseInt(overview.data.MarketCapitalization),
        };
        result.lastUpdates.alphavantageOverview = overview.lastUpdated;
      }
      if (income) {
        result.revenue = processRevenue(income.data.annualReports || []);
        result.lastUpdates.alphavantageIncome = income.lastUpdated;
      }

      return result;
    } catch (e) {
      logger.error(`Error looking for ${company.ticker} data: ${e}`);
      return makeEmptyCompany(company);
    }

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