import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { RedisService } from "src/redis/redis.service";
import { PrismaService } from "src/prisma/prisma.service";
import { CacheKeysService } from "./cache-keys.service";
import { MapToSetKeyValueArray } from "../helpers/map-to-set-key-value";

import type { SetKeyValue } from "src/redis/interfaces/key-set.interface";
import type { CachePreloader } from "../interfaces/preloaders.interface";
import type { Application, Permission, ResourceServer } from "generated/prisma";

interface IExposedPermissions {
  permission: Pick<Permission, "name">;
  application: Pick<Application, "clientId">;
  resourceServer: Pick<ResourceServer, "clientId">;
}

@Injectable()
export class PreloadM2MExposedPermissionsService
  implements CachePreloader<IExposedPermissions>
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

  async preload(): Promise<IExposedPermissions[]> {
    let offset: number = 0;
    let hasMore: boolean = true;

    const elements: IExposedPermissions[] = [];

    while (hasMore) {
      const data = await this.getChunkedExposedPermissions(offset);

      if (data.length > 0) elements.push(...data);
      if (data.length < this.LIMIT) hasMore = false;

      offset += this.LIMIT;
    }

    await this.save(this.format(elements));

    return [];
  }

  format<J>(data: IExposedPermissions[]): J {
    const map = new Map<string, Set<string>>();

    data.forEach((item) => {
      const { application, permission, resourceServer } = item;

      const key =
        this.cacheKeysService.getApplicationResourceServerExposedPermissionsKey(
          application.clientId,
          resourceServer.clientId
        );

      if (!map.has(key)) map.set(key, new Set());

      if (permission.name) map.get(key)!.add(permission.name);
    });

    return MapToSetKeyValueArray(map) as J;
  }

  async save<J>(data: J): Promise<void> {
    const pipeline = this.redisService.pipeline();
    const elements = data as SetKeyValue[];

    elements.forEach((item) => {
      pipeline.del(item.key);

      if (item.members.length) this.redisService.saddToPipeline(pipeline, item);
    });

    await this.redisService.execPipeline(pipeline);
  }

  private async getChunkedExposedPermissions(offset: number) {
    const data = await this.prisma.resourceServerExposedPermission.findMany({
      skip: offset,
      take: this.LIMIT,
      where: {
        isActive: true,
      },
      orderBy: {
        createdAt: "asc",
      },
      select: {
        isActive: true,
        application: {
          select: {
            clientId: true,
          },
        },
        resourceServer: {
          select: {
            clientId: true,
          },
        },
        permission: {
          select: {
            name: true,
          },
        },
      },
    });

    return data;
  }
}
