import {FileStorage} from '../../storage/file';
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
const storage = new FileStorage<YahooCache>('_persistance_/storage/yahooData.json');

export const readYahooCache = () => {
  return storage.read();
};

export const writeYahooCache = (data: YahooCache) => {
  return storage.write(data);
};

// TODO: make async ?
export const addToYahooCache = (ticker: string, data: Partial<YahooData>) => {
  try {
    const cache = storage.readSync() ?? {};
    cache[ticker] = Object.assign(
      {},
      cache[ticker],
      data,
      {lastUpdated: new Date().toISOString()}
    );
    storage.writeSync(cache);
  } catch (e) {
    logger.warn(`Failed to add ${ticker} to Yahoo cache`, e);
  }
};