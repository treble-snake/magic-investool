import {AppContext} from '../context/context';
import {CompanyStock} from '../common/types/companies.types';
import {logger} from '../common/logging/logger';
import {EnrichableCompany, completeCompanyData} from './completeCompanyData';
import {makeAlphavantageApi} from './alphavantage/makeAlphavantageApi';
import {processRevenue} from './alphavantage/mappers/processRevenue';
import {CachedEntity, KeyValueCache} from '../common/types/cache.types';
import {differenceInHours} from 'date-fns';
import {makeFinnhubApi} from './finnhub/makeFinnhubApi';
import {processRecommendation} from './finnhub/mappers/processRecommendation';

const getTimestamp = (company: CompanyStock) => {
  if ('lastUpdated' in company && company.lastUpdated) {
    return new Date(company.lastUpdated).getTime();
  }

  return 0;
};

const capitalizeWords = (name: string) => name
  .split(' ')
  .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
  .join(' ');

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
      .then(() => logger.debug(`${operation}: Cache updated for ${ticker}`))
      .catch(e => logger.warn(`${operation}: Failed to write to cache for ${ticker}`, e));

    return result;
  } catch (e) {
    logger.warn(`${operation}: Couldn't fetch data for ${ticker}, fallback to cache`, e);
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
      const alphavantageApi = makeAlphavantageApi(context);
      const overview = await fetchDataWithCache(
        company.ticker,
        'overview',
        () => alphavantageApi.getCompanyOverview(company.ticker),
        context.cache.alphavantageOverview,
        24,
        forceUpdate
      );
      const income = await fetchDataWithCache(
        company.ticker,
        'income',
        () => alphavantageApi.getIncomeStatement(company.ticker),
        context.cache.alphavantageIncome,
        24 * 30,
        forceUpdate
      );

      const finnhubApi = makeFinnhubApi(context);
      const price = await fetchDataWithCache(
        company.ticker,
        'price',
        () => finnhubApi.getPrice(company.ticker),
        context.cache.finnhubPrice,
        1,
        forceUpdate
      );

      const recommendation = await fetchDataWithCache(
        company.ticker,
        'recommendation',
        () => finnhubApi.getRecommendationTrends(company.ticker),
        context.cache.finnhubRecommendation,
        24,
        forceUpdate
      );

      const result = completeCompanyData(company);

      if (overview) {
        result.name = overview.data.Name;
        result.sector = capitalizeWords(overview.data.Sector);
        result.overview = {
          peRatio: Number.parseFloat(overview.data.PERatio) || 0,
          marketCap: Number.parseInt(overview.data.MarketCapitalization) || 0,
          analystTargetPrice: Number.parseFloat(overview.data.AnalystTargetPrice) || 0
        };
        result.lastUpdates.alphavantageOverview = overview.lastUpdated;
      }
      if (income) {
        result.revenue = processRevenue(income.data.annualReports || []);
        result.lastUpdates.alphavantageIncome = income.lastUpdated;
      }
      if (price) {
        result.price = price.data.c;
        result.lastUpdates.finnhubPrice = price.lastUpdated;
      }
      if (recommendation) {
        result.recommendation = processRecommendation(recommendation.data);
        result.lastUpdates.finnhubRecommendation = recommendation.lastUpdated;
      }

      return result;
    } catch (e) {
      logger.error(`Error looking for ${company.ticker} data: ${e}`, e);
      return completeCompanyData(company);
    }

  },
  /**
   * @param current list of all companies (portfolio or magic formula)
   * @param batchSize how many companies to try to update; important since we have rate limiting in the APIs
   * @return list of all companies with some of them updated
   */
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