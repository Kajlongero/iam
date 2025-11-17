import { Callback } from "ioredis";

export interface CacheGetterSetters {
  get: <T>(key: string, cb?: Callback<string | null>) => Promise<T>;
  mget: <T>(keys: string[]) => Promise<T[]>;
}
