import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { getChunkedData } from "src/prisma/utils/batch-preloader";
import { MapToHashKeyValueArray } from "../helpers/map-to-hash-key-value";

import { RedisService } from "src/redis/redis.service";
import { PrismaService } from "src/prisma/prisma.service";
import { CacheKeysService } from "./cache-keys.service";

import type { CachePreloader } from "../interfaces/preloaders.interface";

import type { HashKeyValue } from "src/redis/interfaces/hash.interface";
import type { Application, Permission, Prisma, Role } from "generated/prisma";

export interface IApiPermissionRules extends Permission {
  application?: Pick<Application, "clientId"> | null;
  permissionAssignmentRules: {
    role: Pick<Role, "id" | "name">;
  }[];
}

@Injectable()
export class PreloadApiPermissionsService
  implements CachePreloader<IApiPermissionRules>
{
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
    private readonly cacheKeysService: CacheKeysService
  ) {}

  async preload(): Promise<IApiPermissionRules[]> {
    const limit = parseInt(this.config.getOrThrow("BATCH_PREFETCH_SIZE"));
    const cursorField = "id";

    const fnOpts = {
      where: {
        isApiScope: true,
      },
      include: {
        application: {
          select: {
            clientId: true,
          },
        },
        permissionAssignmentRules: {
          include: {
            role: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    };

    await getChunkedData({
      limit,
      fnOpts,
      cursorField,

      fn: (args: Prisma.PermissionFindManyArgs) =>
        this.prisma.permission.findMany(args),
      fnSave: (data: IApiPermissionRules[]) => this.save(this.format(data)),
    });

    return [];
  }

  format<J>(data: IApiPermissionRules[]): J {
    const map = new Map<string, Record<string, string>>();

    data.forEach((p) => {
      const { application, permissionAssignmentRules, ...permission } = p;

      const cacheKey = application?.clientId
        ? this.cacheKeysService.getApplicationsApiPermissionsKey(
            application.clientId
          )
        : this.cacheKeysService.getGlobalApiPermissionsMetadataKey();

      if (!map.has(cacheKey)) map.set(cacheKey, {});

      const hash = map.get(cacheKey)!;

      const res: IApiPermissionRules = {
        ...permission,
        permissionAssignmentRules,
      };

      hash[permission.name] = JSON.stringify(res);
    });

    return MapToHashKeyValueArray(map) as J;
  }

  async save<J>(data: J): Promise<void> {
    const pipeline = this.redisService.pipeline();

    this.redisService.mhsetToPipeline(pipeline, data as HashKeyValue[]);

    await pipeline.exec();
  }
}
