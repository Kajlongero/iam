export interface CachePreloader<T> {
  preload: () => Promise<T[]>;
  format: <J>(data: T[]) => J;

  save?: <J>(data: J) => Promise<void>;
}
