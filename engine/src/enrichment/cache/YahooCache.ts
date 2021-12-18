import {Result as BasicYahooResult} from '../yahoo/types/ticker';
import {Result as InsightYahooResult} from '../yahoo/types/insight';
import path from 'path';
import {STORAGE_DIR} from '../../common/config';
import {JsonFileCache} from './JsonFileCache';

export type YahooCacheItem = {
  lastUpdated: string;
  basic: BasicYahooResult;
  insights: InsightYahooResult;
}

export const YAHOO_CACHE_DIR = 'yahoo-cache';

export const makeDefaultYahooCache = (cacheDir = YAHOO_CACHE_DIR) => {
  // TODO: what if the folder doesn't exist
  return new JsonFileCache<YahooCacheItem>(path.join(STORAGE_DIR, cacheDir));
};