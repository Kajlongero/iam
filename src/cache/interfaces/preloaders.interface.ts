import { KeyValue } from "src/redis/interfaces/key-val.interface";

export interface CachePreloader<T> {
  format: (data: T[]) => KeyValue[] | T[];
  preload: () => Promise<T[]>;

  save?: (data: KeyValue[]) => Promise<void>;
}
