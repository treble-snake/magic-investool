import path from 'path';
import {readFile, rm, writeFile} from 'fs/promises';
import {logger} from '../../common/logging/logger';
import {KeyValueCache} from './cache.types';

export class JsonFileCache<T> implements KeyValueCache<T> {
  constructor(
    private storageDir: string
  ) {
  }

  private fullPath(key: string) {
    return path.join(this.storageDir, `${key}.json`);
  }

  async get(key: string) {
    try {
      const fd = await readFile(this.fullPath(key));
      return JSON.parse(fd.toString()) as T;
    } catch (e) {
      logger.debug(`Failed to read cache entry for ${key}`, e);
      return null;
    }
  }

  set(key: string, value: T) {
    return writeFile(this.fullPath(key), JSON.stringify(value)).catch(e => {
      logger.warn(`Unable to write cache entry for ${key}`, e);
    });
  }

  del(key: string) {
    return rm(this.fullPath(key)).catch(e => {
      logger.warn(`Unable to remove cache entry for ${key}`, e);
    });
  }
}