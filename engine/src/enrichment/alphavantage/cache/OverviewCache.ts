import path from 'path';
import {CompanyOverview} from '../types/api';
import {JsonFileCache} from '../../cache/JsonFileCache';
import {STORAGE_DIR} from '../../../common/config';
import {CachedEntity} from '../../../common/types/cache.types';

export type OverviewCacheItem = CachedEntity<CompanyOverview>;

export const AV_OVERVIEW_CACHE_DIR = 'cache/alphavantage/overview';

export const makeDefaultOverviewCache = (cacheDir = AV_OVERVIEW_CACHE_DIR) => {
  return new JsonFileCache<OverviewCacheItem>(path.join(STORAGE_DIR, cacheDir));
};