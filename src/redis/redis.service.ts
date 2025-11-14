import Redis from "ioredis";

import { ConfigService } from "@nestjs/config";
import {
  Logger,
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
} from "@nestjs/common";

import { REDIS_CONSTANTS } from "src/commons/config/redis";

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
  }

  async setJson<T>(key: string, value: T) {
    await this.client.set(key, JSON.stringify(value));
  }

  async getJson<T>(key: string): Promise<Record<string, T>> {
    const result = (await this.client.get(key)) as string;

    return JSON.parse(result) as Record<string, T>;
  }

  onModuleDestroy() {
    this.client.disconnect();
  }
}
