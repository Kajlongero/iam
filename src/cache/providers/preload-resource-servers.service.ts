import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { getChunkedData } from "src/prisma/utils/batch-preloader";
import {
  MapToHashKeyValue,
  MapToHashKeyValueArray,
} from "../helpers/map-to-hash-key-value";

import { RedisService } from "src/redis/redis.service";
import { PrismaService } from "src/prisma/prisma.service";
import { CacheKeysService } from "./cache-keys.service";

import type { HashKeyValue } from "src/redis/interfaces/hash.interface";
import type { CachePreloader } from "../interfaces/preloaders.interface";
import type { Application, Prisma, ResourceServer } from "generated/prisma";

interface IApplicationResourceServer extends ResourceServer {
  application: Pick<Application, "clientId" | "slug">;
}

@Injectable()
export class PreloadResourceServers
  implements CachePreloader<IApplicationResourceServer>
{
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
    private readonly cacheKeysService: CacheKeysService
  ) {}

  async preload(): Promise<IApplicationResourceServer[]> {
    await getChunkedData({
      limit: parseInt(this.config.getOrThrow("BATCH_PREFETCH_SIZE")),
      fnOpts: {
        include: {
          application: {
            select: {
              slug: true,
              clientId: true,
            },
          },
        },
      },
      cursorField: "id",

      fn: (args: Prisma.ResourceServerFindManyArgs) =>
        this.prisma.resourceServer.findMany(args),
      fnSave: (data: IApplicationResourceServer[]) =>
        this.save(this.format(data)),
    });

    return [];
  }

  format<J>(data: IApplicationResourceServer[]): J {
    const lookupKey = this.cacheKeysService.getGlobalRsLookupKey();
    const lookupAppKey =
      this.cacheKeysService.getGlobalApplicationSlugByRsClientIdLookupKey();

    const lookupMap: Record<string, string> = {};
    const lookupAppMap: Record<string, string> = {};

    const resourceServersMap = new Map<string, Record<string, string>>();
    const resourceServersLookupMap = new Map<string, Record<string, string>>();

    data.forEach((item) => {
      const { application, ...rest } = item;

      const rsAppSlug = this.cacheKeysService.getApplicationResourceServersKey(
        application.slug
      );

      const rsLookupKey =
        this.cacheKeysService.getApplicationResourceServerLookupKey(
          application.slug
        );

      if (!resourceServersMap.has(rsAppSlug))
        resourceServersMap.set(rsAppSlug, {});

      if (!resourceServersLookupMap.has(rsLookupKey))
        resourceServersLookupMap.set(rsLookupKey, {});

      const rs = resourceServersMap.get(rsAppSlug)!;
      rs[rest.slug] = JSON.stringify(rest);

      const rsLookup = resourceServersLookupMap.get(rsLookupKey)!;
      rsLookup[rest.name] = rest.slug;

      lookupMap[rest.clientId] = rest.slug;
      lookupAppMap[rest.clientId] = application.slug;
    });

    return [
      MapToHashKeyValue(lookupKey, lookupMap),
      MapToHashKeyValue(lookupAppKey, lookupAppMap),
      MapToHashKeyValueArray(resourceServersMap),
      MapToHashKeyValueArray(resourceServersLookupMap),
    ] as J;
  }

  async save<J>(data: J): Promise<void> {
    const pipeline = this.redisService.pipeline();

    const [lookupMap, lookupAppMap, resourceServers, resourceServersLookup] =
      data as [HashKeyValue, HashKeyValue, HashKeyValue[], HashKeyValue[]];

    this.redisService.hsetToPipeline(pipeline, lookupMap);
    this.redisService.hsetToPipeline(pipeline, lookupAppMap);
    this.redisService.mhsetToPipeline(pipeline, resourceServers);
    this.redisService.mhsetToPipeline(pipeline, resourceServersLookup);

    await this.redisService.execPipeline(pipeline);
  }
}
