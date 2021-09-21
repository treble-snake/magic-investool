export interface KeyValueCache<T> {
  set(key: string, value: T): Promise<void>;

  get(key: string): Promise<T | null>;

  del(key: string): Promise<void>;
}
