import Redis, { ChainableCommander } from "ioredis";

import { ConfigService } from "@nestjs/config";
import {
  Logger,
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
} from "@nestjs/common";

import { REDIS_CONSTANTS } from "src/commons/config/redis";

import type { KeyValue } from "./interfaces/key-val.interface";
import { HashKeyValue } from "./interfaces/hash.interface";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;
  private logger: Logger = new Logger();

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

  pipeline(): ChainableCommander {
    return this.client.pipeline();
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
    await pipeline.exec();
  }

  onModuleDestroy() {
    this.client.disconnect();
  }
}
