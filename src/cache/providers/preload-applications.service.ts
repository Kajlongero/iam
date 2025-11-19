import { Injectable } from "@nestjs/common";

import { RedisService } from "src/redis/redis.service";
import { PrismaService } from "src/prisma/prisma.service";
import { CacheKeysService } from "./cache-keys.service";

import type { Application } from "generated/prisma";
import type { HashKeyValue } from "src/redis/interfaces/hash.interface";
import type { CachePreloader } from "../interfaces/preloaders.interface";

@Injectable()
export class PreloadApplicationsService implements CachePreloader<Application> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,

    private readonly cacheKeysService: CacheKeysService
  ) {}

  async preload<T>(): Promise<T[]> {
    const applications = await this.prisma.application.findMany({});

    return applications as T[];
  }

  format<J>(data: Application[]): J {
    const map: HashKeyValue = {
      key: this.cacheKeysService.getGlobalApplicationsKey(),
      values: [],
    };

    data.forEach((app) => {
      map.values.push({
        key: app.clientId,
        value: JSON.stringify(app),
      });
    });

    return map as J;
  }

  async save<T>(args: T): Promise<void> {
    const pipeline = this.redisService.pipeline();

    this.redisService.hsetToPipeline(pipeline, args as HashKeyValue);

    await pipeline.exec();
  }
}
