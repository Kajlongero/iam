import Redis from "ioredis";

import { ConfigService } from "@nestjs/config";
import {
  Logger,
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
} from "@nestjs/common";

import { REDIS_CONSTANTS } from "src/commons/config/redis";

import type { KeyValue } from "./interfaces/key-val.interface";

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

  async pipeline(args: KeyValue[]) {
    const pipeline = this.client.pipeline();

    for (const arg of args) {
      if (arg.ttl && arg.expireOptions) {
        const { key, value, ttl, expireOptions } = arg;

        pipeline.set(key, value as string, expireOptions as "EX", ttl);
      } else {
        pipeline.set(arg.key, arg.value as string);
      }
    }

    const results = await pipeline.exec();

    return results;
  }

  onModuleDestroy() {
    this.client.disconnect();
  }
}
