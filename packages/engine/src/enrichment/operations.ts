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

export enum DataParts {
  Overview = 'Overview',
  Price = 'Price',
  Revenue = 'Revenue',
  Trends = 'Trends'
}

type Options = {
  parts?: DataParts[]
}

export const enrichmentOperations = (context: AppContext) => ({
  /**
   * Best effort update, should not throw
   * @param company - at least ticker should be defined
   * @param forceUpdate - tries to get from cache first if false, skips cache check if true
   * @param options - additional options
   */
  async enrichCompany<T extends EnrichableCompany>(
    company: T,
    forceUpdate = false,
    options: Options = {}
  ) {
    if (!company.ticker) {
      throw new Error(`Given company (${company.name}) does not have a ticker`);
    }

    try {
      const result = completeCompanyData(company);

      const alphavantageApi = makeAlphavantageApi(context);

      if (!options.parts || options.parts.includes(DataParts.Overview)) {
        logger.debug(`Fetching ${DataParts.Overview} for ${company.ticker}`);
        const overview = await fetchDataWithCache(
          company.ticker,
          'overview',
          () => alphavantageApi.getCompanyOverview(company.ticker),
          context.cache.alphavantageOverview,
          24,
          forceUpdate
        );

        if (overview) {
          logger.debug(`Found ${DataParts.Overview} for ${company.ticker}`);
          result.name = overview.data.Name;
          result.sector = capitalizeWords(overview.data.Sector);
          result.overview = {
            peRatio: Number.parseFloat(overview.data.PERatio) || 0,
            marketCap: Number.parseInt(overview.data.MarketCapitalization) || 0,
            analystTargetPrice: Number.parseFloat(overview.data.AnalystTargetPrice) || 0
          };
          result.prices.data.target = Number.parseFloat(overview.data.AnalystTargetPrice) || 0;
          result.lastUpdates.alphavantageOverview = overview.lastUpdated;
        }
      }

      if (!options.parts || options.parts.includes(DataParts.Revenue)) {
        logger.debug(`Fetching ${DataParts.Revenue} for ${company.ticker}`);
        const income = await fetchDataWithCache(
          company.ticker,
          'income',
          () => alphavantageApi.getIncomeStatement(company.ticker),
          context.cache.alphavantageIncome,
          24 * 30,
          forceUpdate
        );

        if (income) {
          logger.debug(`Found ${DataParts.Revenue} for ${company.ticker}`);
          result.revenue = processRevenue(income.data.annualReports || []);
          result.lastUpdates.alphavantageIncome = income.lastUpdated;
        }
      }

      const finnhubApi = makeFinnhubApi(context);

      if (!options.parts || options.parts.includes(DataParts.Price)) {
        logger.debug(`Fetching ${DataParts.Price} for ${company.ticker}`);
        const price = await fetchDataWithCache(
          company.ticker,
          'price',
          () => finnhubApi.getPrice(company.ticker),
          context.cache.finnhubPrice,
          1,
          forceUpdate
        );

        if (price) {
          logger.debug(`Found ${DataParts.Price} for ${company.ticker}`);
          result.price = price.data.c;
          result.prices.data.current = price.data.c;
          result.lastUpdates.finnhubPrice = price.lastUpdated;
        }
      }

      if (!options.parts || options.parts.includes(DataParts.Trends)) {
        logger.debug(`Fetching ${DataParts.Trends} for ${company.ticker}`);
        const recommendation = await fetchDataWithCache(
          company.ticker,
          'recommendation',
          () => finnhubApi.getRecommendationTrends(company.ticker),
          context.cache.finnhubRecommendation,
          24,
          forceUpdate
        );

        if (recommendation) {
          logger.debug(`Found ${DataParts.Trends} for ${company.ticker}`);
          result.recommendation = processRecommendation(recommendation.data);
          result.lastUpdates.finnhubRecommendation = recommendation.lastUpdated;
        }
      }

      if (!options.parts || options.parts.length === 0) {
        result.lastUpdated = new Date().toISOString();
      }

      return result;
    } catch (e) {
      logger.error(`Error looking for ${company.ticker} data: ${e}`, e);
      return completeCompanyData(company);
    }

  },
  getOutdatedTickers(current: CompanyStock[], batchSize = 2) {
    return [...current]
      .sort((a, b) => getTimestamp(a) - getTimestamp(b))
      .slice(0, batchSize)
      .map(it => it.ticker);
  },
  /**
   * @param current list of all companies (portfolio or magic formula)
   * @param batchSize how many companies to try to update; important since we have rate limiting in the APIs
   * @return list of all companies with some of them updated
   */
  async enrichOutdated(current: CompanyStock[], batchSize = 2) {
    logger.info(`Enriching max ${batchSize} outdated companies`);

    const toEnrich = this.getOutdatedTickers(current, batchSize);
    logger.debug(`To enrich: ${toEnrich}`);

    return Promise.all(current.map((company) => {
      if (!toEnrich.includes(company.ticker)) {
        return company;
      }

      return this.enrichCompany(company);
    }));
  },
  async enrichTicker(ticker: string, forceUpdate = false, options: Options = {}) {
    const {portfolioStorage, mfStorage} = context;
    const [portfolioItem, mfItem] = await Promise.all([
      portfolioStorage.findByTicker(ticker),
      mfStorage.findByTicker(ticker)
    ]);

    // todo: this is kinda weird and inefficient.
    let useForce = forceUpdate;
    const savePromises = [];
    if (portfolioItem) {
      savePromises.push(portfolioStorage.updateOne(
        ticker,
        await this.enrichCompany(portfolioItem, useForce, options)
      ));
      // just read from the cache now
      useForce = false;
    }

    if (mfItem) {
      savePromises.push(mfStorage.updateOne(
        ticker,
        await this.enrichCompany(mfItem, useForce, options)
      ));
    }

    await Promise.all(savePromises);
  }
});