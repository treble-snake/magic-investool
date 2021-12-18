import {existsSync, mkdirSync} from 'fs';
import path from 'path';
import {STORAGE_DIR} from '../../common/config';
import {YAHOO_CACHE_DIR} from '../../enrichment/cache/YahooCache';

export const prepareStorage = () => {
  const yahooCachePath = path.join(STORAGE_DIR, YAHOO_CACHE_DIR);
  if (!existsSync(yahooCachePath)) {
    console.log('Creating yahoo cache dir.');
    mkdirSync(yahooCachePath);
  }

  console.log('Dir structure is good.');
}
