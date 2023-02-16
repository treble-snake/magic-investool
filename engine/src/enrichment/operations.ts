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

// const fetchData = async (ticker: string, forceUpdate: boolean, context: AppContext) => {
//   logger.info(`Enriching ${ticker}`);
//
//   if (!forceUpdate) {
//     const cached = await context.yahooCache.get(ticker);
//     if (cached) {
//       const cacheAge = differenceInHours(new Date(), new Date(cached.lastUpdated));
//       const threshold = await context.userAccountStorage.getAccountData()
//         .then(it => it.yahooCacheThreshold);
//       if (cacheAge <= threshold) {
//         logger.debug(`Using fresh enough (${cacheAge}h) cache values for ${ticker}`);
//         return cached;
//       }
//     }
//     logger.debug(`Couldn\'t find info in the cache for ${ticker}`);
//   }
//
//   // TODO: don't fail all if only 1 req failed
//   // TODO: decouple API data source, read from context
//   const api = yahooApi(context);
//   const [basic, insights] = await Promise.all([
//     api.getCompanyData(ticker),
//     api.getInsightData(ticker)
//   ]);
//
//   const result = {basic, insights, lastUpdated: new Date().toISOString()};
//   context.yahooCache
//     .set(ticker, result)
//     .then(() => logger.info(`Cache updated for ${ticker}`))
//     .catch(e => logger.warn(`Failed to write to cache for ${ticker}`, e));
//
//   return result;
// };

const fetchData = async <T>(
  ticker: string,
  requestName: string,
  request: () => Promise<T>,
  cache: KeyValueCache<CachedEntity<T>>,
  cacheThreshold: number,
  forceUpdate: boolean
) => {
  if (!forceUpdate) {
    const cached = await cache.get(ticker);
    if (cached) {
      const cacheAge = differenceInHours(new Date(), new Date(cached.lastUpdated));
      if (cacheAge <= cacheThreshold) {
        logger.debug(`Using fresh enough (${cacheAge}h) cache values for ${ticker}`);
        return cached.data;
      }
    }
    logger.debug(`Couldn\'t find info in the cache for ${ticker}`);
  }

  try {
    const data = await request();
    cache
      .set(ticker, {data, lastUpdated: new Date().toISOString()})
      .then(() => logger.info(`Cache updated for ${ticker}`))
      .catch(e => logger.warn(`Failed to write to cache for ${ticker}`, e));

    return data;
  } catch (e) {
    const cached = await cache.get(ticker);
    return cached?.data;
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
      const alphaVantageApi = alphavantageApi(context);
      const overview = await fetchData(
        company.ticker,
        'overview',
        () => alphaVantageApi.getCompanyOverview(company.ticker),
        makeDefaultOverviewCache(),
        24,
        forceUpdate
      );
      const income = await fetchData(
        company.ticker,
        'income',
        () => alphaVantageApi.getIncomeStatement(company.ticker),
        makeDefaultIncomeCache(),
        24 * 30,
        forceUpdate
      );

      return {
        ...makeEmptyCompany(company),
        basics: {
          peRatio: overview ? Number.parseFloat(overview.PERatio) : 0,
          marketCap: overview ? Number.parseInt(overview.MarketCapitalization, 10) : 0,
        },
        name: overview?.Name || company.name,
        sector: overview?.Sector,
        // revenue
        revenue: processRevenue(income?.annualReports || []),
        // updates - TODO: needs to be updated based on cache
        lastUpdates: {
          alphavantageFundamentals: new Date().toISOString()
        },
      } as CompanyStock;

      // const data = await fetchData(company.ticker, forceUpdate, context)
      //   .catch(e => {
      //     logger.warn(`Unable to get data for ${company.ticker}, fallback to cache.`, e);
      //     return context.yahooCache.get(company.ticker)
      //   });
      //
      // if (data) {
      //   return {
      //     ...makeEmptyCompany(company),
      //     ...enrichCompanyWithYahoo(data.basic, data.insights),
      //     lastUpdated: data.lastUpdated
      //   };
      // }
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