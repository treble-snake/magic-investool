import path from 'path';
import {PriceQuote} from '../types/api';
import {JsonFileCache} from '../../cache/JsonFileCache';
import {STORAGE_DIR} from '../../../common/config';
import {CachedEntity} from '../../../common/types/cache.types';

export type PriceCacheItem = CachedEntity<PriceQuote>;

export const FH_PRICE_CACHE_DIR = 'cache/finnhub/price';

export const makeDefaultPriceCache = (cacheDir = FH_PRICE_CACHE_DIR) => {
  return new JsonFileCache<PriceCacheItem>(path.join(STORAGE_DIR, cacheDir));
};