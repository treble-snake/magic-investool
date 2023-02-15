// import path from 'path';
// import {STORAGE_DIR} from '../../common/config';
// import {JsonFileCache} from './JsonFileCache';
// import {CompanyOverview} from '../alphavantage/types/api';
//
// export type AlphavantageCacheCacheItem = {
//   overview?: {
//     lastUpdated: string;
//     data: CompanyOverview
//   }
// }
//
// export const YAHOO_CACHE_DIR = 'alphavantage-cache';
//
// export const makeDefaultYahooCache = (cacheDir = YAHOO_CACHE_DIR) => {
//   // TODO: what if the folder doesn't exist
//   return new JsonFileCache<AlphavantageCacheCacheItem>(path.join(STORAGE_DIR, cacheDir));
// };