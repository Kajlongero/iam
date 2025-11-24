import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { RedisService } from "src/redis/redis.service";
import { PrismaService } from "src/prisma/prisma.service";
import { CacheKeysService } from "./cache-keys.service";
import { MapToHashKeyValueArray } from "../helpers/map-to-hash-key-value";

import type { HashKeyValue } from "src/redis/interfaces/hash.interface";
import type { CachePreloader } from "../interfaces/preloaders.interface";
import type { Application, Permission, ResourceServer } from "generated/prisma";

interface IConsumptionPermissions {
  permission: Pick<Permission, "name">;
  clientResourceServer: Pick<ResourceServer, "clientId">;
  receptorResourceServer: Pick<ResourceServer, "clientId"> & {
    application: Pick<Application, "clientId">;
  };
}

@Injectable()
export class PreloadM2MConsumptionPermissionsService
  implements CachePreloader<IConsumptionPermissions>
{
  private LIMIT: number;

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
    private readonly cacheKeysService: CacheKeysService
  ) {
    this.LIMIT = parseInt(this.config.getOrThrow("BATCH_PREFETCH_SIZE"));
  }

  async preload(): Promise<IConsumptionPermissions[]> {
    let offset: number = 0;
    let hasMore: boolean = true;

    const elements: IConsumptionPermissions[] = [];

    while (hasMore) {
      const data = await this.getChunkedConsumptionPermissions(offset);

      if (data.length > 0) elements.push(...data);
      if (data.length < this.LIMIT) hasMore = false;

      offset += this.LIMIT;
    }

    await this.save(this.format(elements));

    return [];
  }

  format<J>(data: IConsumptionPermissions[]): J {
    const map = new Map<string, Record<string, string>>();

    data.forEach((item) => {
      const { permission, clientResourceServer, receptorResourceServer } = item;

      const key =
        this.cacheKeysService.getApplicationResourceServerConsumptionPermissionsKey(
          receptorResourceServer.application.clientId,
          receptorResourceServer.clientId,
          clientResourceServer.clientId
        );

      if (!map.has(key)) map.set(key, {});

      const record = map.get(key)!;

      record[permission.name] = JSON.stringify({ name: permission.name });
    });

    return MapToHashKeyValueArray(map) as J;
  }

  async save<J>(data: J): Promise<void> {
    const pipeline = this.redisService.pipeline();
    const elements = data as HashKeyValue[];

    elements.forEach((item) => {
      pipeline.del(item.key);

      this.redisService.hsetToPipeline(pipeline, item);
    });

    await this.redisService.execPipeline(pipeline);
  }

  private async getChunkedConsumptionPermissions(offset: number) {
    const data = await this.prisma.resourceServerConsumptionPermission.findMany(
      {
        skip: offset,
        take: this.LIMIT,
        where: {
          isActive: true,
        },
        orderBy: {
          createdAt: "asc",
        },
        select: {
          permission: {
            select: {
              name: true,
            },
          },
          clientResourceServer: {
            select: {
              clientId: true,
            },
          },
          receptorResourceServer: {
            select: {
              clientId: true,
              application: {
                select: {
                  clientId: true,
                },
              },
            },
          },
        },
      }
    );

    return data;
  }
}
