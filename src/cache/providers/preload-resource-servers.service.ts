import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { getChunkedData } from "src/prisma/utils/batch-preloader";

import { RedisService } from "src/redis/redis.service";
import { PrismaService } from "src/prisma/prisma.service";
import { CacheKeysService } from "./cache-keys.service";

import type { HashKeyValue } from "src/redis/interfaces/hash.interface";
import type { CachePreloader } from "../interfaces/preloaders.interface";
import type { Application, Prisma, ResourceServer } from "generated/prisma";

interface IApplicationResourceServer extends ResourceServer {
  application: Pick<Application, "clientId">;
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
    const resourceServersMap = new Map();
    const resourceServersNameMap = new Map();

    const globalLookupMap = new Map();

    const globalLookupKey =
      this.cacheKeysService.getGlobalResourceServerLookupKey();

    data.forEach((item) => {
      const { application, ...rest } = item;
      const { clientId } = application;

      const rsKey =
        this.cacheKeysService.getApplicationsResourceServersKey(clientId);
      const rsNameKey =
        this.cacheKeysService.getApplicationsResourceServersNamesMappedKey(
          clientId
        );

      if (!resourceServersMap.has(rsKey)) {
        resourceServersMap.set(rsKey, {});
      }

      if (!resourceServersNameMap.has(rsNameKey)) {
        resourceServersNameMap.set(rsNameKey, {});
      }

      const rsElem = resourceServersMap.get(rsKey) as Record<string, string>;
      const rsNameElem = resourceServersNameMap.get(rsNameKey) as Record<
        string,
        string
      >;

      rsElem[rest.clientId] = JSON.stringify(rest);
      rsNameElem[rest.name] = rest.clientId;

      globalLookupMap[rest.clientId] = application.clientId;
    });

    return [
      Array.from(resourceServersMap.entries()).map(([key, value]) => {
        const keyName = key as string;

        return {
          key: keyName,
          values: Object.entries(value as Record<string, unknown>).map(
            ([fieldKey, fieldValue]) => ({
              key: fieldKey,
              value: fieldValue,
            })
          ),
        };
      }),
      Array.from(resourceServersNameMap.entries()).map(([key, value]) => {
        const keyName = key as string;

        return {
          key: keyName,
          values: Object.entries(value as Record<string, unknown>).map(
            ([fieldKey, fieldValue]) => ({
              key: fieldKey,
              value: fieldValue,
            })
          ),
        };
      }),
      [
        {
          key: globalLookupKey,
          values: Object.entries(globalLookupMap).map(
            ([fieldKey, fieldValue]) => ({
              key: fieldKey,
              value: fieldValue as string,
            })
          ),
        },
      ],
    ] as J;
  }

  async save<J>(data: J): Promise<void> {
    const pipeline = this.redisService.pipeline();

    const [resourceServers, resourceServersNames, lookupHash] = data as [
      HashKeyValue[],
      HashKeyValue[],
      HashKeyValue,
    ];

    this.redisService.mhsetToPipeline(pipeline, resourceServers);
    this.redisService.mhsetToPipeline(pipeline, resourceServersNames);

    if (lookupHash.values.length > 0)
      this.redisService.hsetToPipeline(pipeline, lookupHash);

    await this.redisService.execPipeline(pipeline);
  }
}
