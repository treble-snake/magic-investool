import {existsSync} from 'fs';
import path from 'path';
import {STORAGE_DIR} from '../../common/config';
import {YAHOO_CACHE_DIR} from '../../enrichment/cache/YahooCache';
import {
  AV_OVERVIEW_CACHE_DIR
} from '../../enrichment/alphavantage/cache/OverviewCache';
import {
  AV_INCOME_CACHE_DIR
} from '../../enrichment/alphavantage/cache/IncomeCache';
import {mkdirpSync, removeSync} from 'fs-extra';

export const prepareStorage = () => {
  [
    path.join(STORAGE_DIR, AV_OVERVIEW_CACHE_DIR),
    path.join(STORAGE_DIR, AV_INCOME_CACHE_DIR),
  ].forEach(dir => {
    if (!existsSync(dir)) {
      console.log(`Creating dir ${dir}`);
      mkdirpSync(dir);
    }
  });

  const yahooCacheDir = path.join(STORAGE_DIR, YAHOO_CACHE_DIR);
  if (existsSync(yahooCacheDir)) {
    console.log(`Removing dir ${yahooCacheDir}`);
    removeSync(yahooCacheDir);
  }

  console.log('Dir structure is good.');
};
