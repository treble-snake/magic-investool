import {KeyValueCache} from '../../src/common/types/cache.types';

export const emptyCache = (): KeyValueCache<any> => ({
  async get(key: string): Promise<any> {
    return null;
  },
  async set(key: string, value: any): Promise<void> {
    // do nothing
  },
  async del(key: string): Promise<void> {
    // do nothing
  }
});