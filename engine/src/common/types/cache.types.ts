export interface KeyValueCache<T> {
// TODO: Set T, Get CachedEntity<T> ?
  set(key: string, value: T): Promise<void>;

  get(key: string): Promise<T | null>;

  del(key: string): Promise<void>;
}

export type CachedEntity <T> = {
  lastUpdated: string;

  data: T;
}