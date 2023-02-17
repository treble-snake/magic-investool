import path from 'path';
import {readFile, rm, writeFile} from 'fs/promises';
import {logger} from '../../common/logging/logger';
import {KeyValueCache} from '../../common/types/cache.types';

export class JsonFileCache<T> implements KeyValueCache<T> {
  constructor(
    private storageDir: string
  ) {
    // TODO: should it ensure the storageDir exists?
    //       currently there is a prepareStorage() thingy, but there should be a better way ?
    //       maybe it's not to bad to check the dir each time
  }

  private fullPath(key: string) {
    return path.join(this.storageDir, `${key}.json`);
  }

  async get(key: string) {
    try {
      const fd = await readFile(this.fullPath(key));
      return JSON.parse(fd.toString()) as T;
    } catch (e) {
      // TODO: use verbose or trace or something, this is unhelpful even on the debug level
      // logger.debug(`Failed to read cache entry for ${key}`, e);
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