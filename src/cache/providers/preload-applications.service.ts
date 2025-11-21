import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { getChunkedData } from "src/prisma/utils/batch-preloader";
import { MapToHashKeyValue } from "../helpers/map-to-hash-key-value";

import { RedisService } from "src/redis/redis.service";
import { PrismaService } from "src/prisma/prisma.service";
import { CacheKeysService } from "./cache-keys.service";

import type { HashKeyValue } from "src/redis/interfaces/hash.interface";
import type { CachePreloader } from "../interfaces/preloaders.interface";
import type { Application, Prisma } from "generated/prisma";

@Injectable()
export class PreloadApplicationsService implements CachePreloader<Application> {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
    private readonly cacheKeysService: CacheKeysService
  ) {}

  async preload<T>(): Promise<T[]> {
    const limit = parseInt(this.config.getOrThrow("BATCH_PREFETCH_SIZE"));
    const cursorField = "id";

    const fnOpts = {};

    await getChunkedData({
      limit,
      fnOpts,
      cursorField,

      fn: (args: Prisma.ApplicationFindManyArgs) =>
        this.prisma.application.findMany(args),
      fnSave: (data: Application[]) => this.save(this.format(data)),
    });

    return [];
  }

  format<J>(data: Application[]): J {
    const key = this.cacheKeysService.getGlobalApplicationsKey();
    const map: Record<string, string> = {};

    data.forEach((app) => (map[app.clientId] = JSON.stringify(app)));

    return MapToHashKeyValue(key, map) as J;
  }

  async save<T>(args: T): Promise<void> {
    const pipeline = this.redisService.pipeline();

    this.redisService.hsetToPipeline(pipeline, args as HashKeyValue);

    await pipeline.exec();
  }
}
