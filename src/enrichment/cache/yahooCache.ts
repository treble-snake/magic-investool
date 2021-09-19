import {JsonFileStorage, makeFileStorage} from '../../storage/file';
import {Result as BasicYahooResult} from '../yahoo/types/ticker';
import {Result as InsightYahooResult} from '../yahoo/types/insight';
import {logger} from '../../common/logging/logger';

type YahooData = {
  lastUpdated: string;
  basic: BasicYahooResult;
  insights: InsightYahooResult;
}

type YahooCache = Record<string, YahooData>;

// TODO: bad singleton, bad!
const storage = makeFileStorage<YahooCache>('yahooData.json');

// TODO: fix cache
export const readYahooCache = async (): Promise<YahooCache|null> => {
  return storage.read();
};

export const writeYahooCache = (data: YahooCache) => {
  return storage.write(data);
};

export const addToYahooCache = async (ticker: string, data: Partial<YahooData>) => {
  try {
    const cache = (await storage.read()) ?? {};
    cache[ticker] = Object.assign(
      {},
      cache[ticker],
      data,
      {lastUpdated: new Date().toISOString()}
    );
    await storage.write(cache);
  } catch (e) {
    logger.warn(`Failed to add ${ticker} to Yahoo cache`, e);
  }
};