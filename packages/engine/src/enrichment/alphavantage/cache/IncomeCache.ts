import path from 'path';
import {IncomeStatement} from '../types/api';
import {JsonFileCache} from '../../cache/JsonFileCache';
import {STORAGE_DIR} from '../../../common/config';
import {CachedEntity} from '../../../common/types/cache.types';

export type IncomeCacheItem = CachedEntity<IncomeStatement>;

export const AV_INCOME_CACHE_DIR = 'cache/alphavantage/income';

export const makeDefaultIncomeCache = (cacheDir = AV_INCOME_CACHE_DIR) => {
  return new JsonFileCache<IncomeCacheItem>(path.join(STORAGE_DIR, cacheDir));
};