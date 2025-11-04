export interface CachePreloader<T> {
  preload: () => Promise<T[]>;
  format: (data: T[]) => Promise<void>;
}
