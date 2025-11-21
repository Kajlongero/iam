import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { getChunkedData } from "src/prisma/utils/batch-preloader";
import { MapToHashKeyValueArray } from "../helpers/map-to-hash-key-value";

import { RedisService } from "src/redis/redis.service";
import { PrismaService } from "src/prisma/prisma.service";
import { CacheKeysService } from "./cache-keys.service";

import type { CachePreloader } from "../interfaces/preloaders.interface";

import type { HashKeyValue } from "src/redis/interfaces/hash.interface";
import type { Application, Permission, Role } from "generated/prisma";

export interface IPermissionRules extends Permission {
  application?: Pick<Application, "clientId"> | null;
  permissionAssignmentRules: {
    role: Pick<Role, "id" | "name">;
  }[];
  roleAuthorityRestrictions: {
    targetRole: Pick<Role, "id" | "name">;
    executingRole: Pick<Role, "id" | "name">;
  }[];
}

@Injectable()
export class PreloadUserPermissionsService
  implements CachePreloader<IPermissionRules>
{
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
    private readonly cacheKeysService: CacheKeysService
  ) {}

  async preload(): Promise<IPermissionRules[]> {
    const limit = parseInt(this.config.getOrThrow("BATCH_PREFETCH_SIZE"));
    const cursorField = "id";

    const fnOpts = {
      where: {
        isApiScope: false,
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
        roleAuthorityRestrictions: {
          include: {
            targetRole: {
              select: {
                id: true,
                name: true,
              },
            },
            executingRole: {
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

      fn: (args: object) => this.prisma.permission.findMany(args),
      fnSave: (data: IPermissionRules[]) => this.save(this.format(data)),
    });

    return [];
  }

  format<T>(data: IPermissionRules[]): T {
    const permissionsByCacheKey = new Map<string, Record<string, string>>();
    const globalKeyName =
      this.cacheKeysService.getGlobalUserPermissionsMetadataKey();

    permissionsByCacheKey.set(globalKeyName, {});

    data.forEach((p) => {
      const {
        application,
        permissionAssignmentRules,
        roleAuthorityRestrictions,
        ...permission
      } = p;

      const cacheKey = application?.clientId
        ? this.cacheKeysService.getApplicationsUserPermissionsKey(
            application.clientId
          )
        : globalKeyName;

      if (!permissionsByCacheKey.has(cacheKey))
        permissionsByCacheKey.set(cacheKey, {});

      const record = permissionsByCacheKey.get(cacheKey)!;
      const key = permission.name;

      const res: IPermissionRules = {
        ...permission,
        permissionAssignmentRules,
        roleAuthorityRestrictions,
      };

      record[key] = JSON.stringify(res);
    });

    return MapToHashKeyValueArray(permissionsByCacheKey) as T;
  }

  async save<J>(data: J): Promise<void> {
    const pipeline = this.redisService.pipeline();

    this.redisService.mhsetToPipeline(pipeline, data as HashKeyValue[]);

    await pipeline.exec();
  }
}
