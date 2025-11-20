import Redis, { Callback, ChainableCommander } from "ioredis";

import { ConfigService } from "@nestjs/config";
import {
  Logger,
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
} from "@nestjs/common";

import { REDIS_CONSTANTS } from "src/commons/config/redis";

import type { KeyValue } from "./interfaces/key-val.interface";
import type { HashKeyValue } from "./interfaces/hash.interface";
import type { CacheGetterSetters } from "src/cache/interfaces/cache-getters-setters.interface";

@Injectable()
export class RedisService
  implements OnModuleInit, OnModuleDestroy, CacheGetterSetters
{
  private client: Redis;
  private logger: Logger = new Logger("RedisService");

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const host = this.configService.getOrThrow<string>(
      REDIS_CONSTANTS.REDIS_HOST
    );
    const port = this.configService.getOrThrow<number>(
      REDIS_CONSTANTS.REDIS_PORT
    );

    this.client = new Redis({
      host,
      port,
    });

    this.client.on("connect", () => {
      this.logger.log("Connected Successfully to Redis.");
    });

    this.client.on("error", (err) => {
      this.logger.error("Redis error: ", err);
    });

    this.client.on("end", () => {
      this.logger.log("Disconnected from Redis.");
    });
  }

  async ttl(key: string) {
    return await this.client.ttl(key);
  }

  async exists(key: string | string[]) {
    return Array.isArray(key)
      ? await this.client.exists(...key)
      : await this.client.exists(key);
  }

  async hexists(hash: string, key: string) {
    return await this.client.hexists(hash, key);
  }

  async get<T>(key: string, cb?: Callback<string | null>): Promise<T> {
    return (await this.client.get(key, cb)) as T;
  }

  async mget<T>(key: string[]): Promise<T> {
    return (await this.client.mget(key)) as T;
  }

  async hget<T>(key: string, field: string, cb?: Callback<string | null>) {
    return (await this.client.hget(key, field, cb)) as T;
  }

  async hmget<T>(key: string, fields: string[]) {
    return (await this.client.hmget(key, ...fields)) as T;
  }

  async hgetall<T>(key: string) {
    return (await this.client.hgetall(key)) as T;
  }

  async expire(key: string, seconds: number) {
    return await this.client.expire(key, seconds);
  }

  pipeline(): ChainableCommander {
    return this.client.pipeline();
  }

  ttlToPipeline(pipeline: ChainableCommander, key: string) {
    pipeline.ttl(key);
  }

  existsToPipeline(pipeline: ChainableCommander, key: string | string[]) {
    pipeline.exists(...key);
  }

  hexistsToPipeline(pipeline: ChainableCommander, hash: string, key: string) {
    pipeline.hexists(hash, key);
  }

  getToPipeline(pipeline: ChainableCommander, key: string) {
    pipeline.get(key);
  }

  mgetToPipeline(pipeline: ChainableCommander, keys: string[]) {
    pipeline.mget(...keys);
  }

  hgetToPipeline(pipeline: ChainableCommander, key: string, field: string) {
    pipeline.hget(key, field);
  }

  hmgetToPipeline(pipeline: ChainableCommander, key: string, fields: string[]) {
    pipeline.hmget(key, ...fields);
  }

  hgetallToPipeline(pipeline: ChainableCommander, key: string) {
    pipeline.hgetall(key);
  }

  setToPipeline(pipeline: ChainableCommander, keyValue: KeyValue) {
    pipeline.set(keyValue.key, keyValue.value as string);
  }

  msetToPipeline(pipeline: ChainableCommander, keyValues: KeyValue[]) {
    const flattenedArgs = keyValues.flatMap((kv) => [
      kv.key,
      kv.value as string,
    ]);

    pipeline.mset(...flattenedArgs);
  }

  hsetToPipeline(pipeline: ChainableCommander, data: HashKeyValue) {
    const flattenedArgs = data.values.flatMap((kv) => [
      kv.key,
      kv.value as string,
    ]);

    pipeline.hset(data.key, ...flattenedArgs);
  }

  mhsetToPipeline(pipeline: ChainableCommander, data: HashKeyValue[]) {
    data.forEach((hashKeyValue) => {
      this.hsetToPipeline(pipeline, hashKeyValue);
    });
  }

  async execPipeline(pipeline: ChainableCommander) {
    return await pipeline.exec();
  }

  async del(key: string | string[]) {
    return Array.isArray(key)
      ? await this.client.del(...key)
      : await this.client.del(key);
  }

  onModuleDestroy() {
    this.client.disconnect();
  }
}
