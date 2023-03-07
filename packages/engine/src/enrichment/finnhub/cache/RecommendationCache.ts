import path from 'path';
import {RecommendationTrends} from '../types/api';
import {JsonFileCache} from '../../cache/JsonFileCache';
import {STORAGE_DIR} from '../../../common/config';
import {CachedEntity} from '../../../common/types/cache.types';

export type RecommendationCacheItem = CachedEntity<RecommendationTrends>;

export const FH_RECOMMENDATION_CACHE_DIR = 'cache/finnhub/recommendation';

export const makeDefaultRecommendationCache = (cacheDir = FH_RECOMMENDATION_CACHE_DIR) => {
  return new JsonFileCache<RecommendationCacheItem>(path.join(STORAGE_DIR, cacheDir));
};