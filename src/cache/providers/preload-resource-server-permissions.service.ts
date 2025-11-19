import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { getChunkedData } from "src/prisma/utils/batch-preloader";

import { RedisService } from "src/redis/redis.service";
import { PrismaService } from "src/prisma/prisma.service";
import { CacheKeysService } from "./cache-keys.service";

import type { CachePreloader } from "../interfaces/preloaders.interface";

import type { HashKeyValue } from "src/redis/interfaces/hash.interface";
import type { Application, Permission, Role } from "generated/prisma";

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
    await getChunkedData({
      limit: parseInt(this.config.getOrThrow("BATCH_PREFETCH_SIZE")),
      fnOpts: {
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
      },
      cursorField: "id",
      fn: (args: object) => this.prisma.permission.findMany(args),
      fnSave: (data: IApiPermissionRules[]) => this.save(this.format(data)),
    });

    return [];
  }

  format<J>(data: IApiPermissionRules[]): J {
    const map = new Map();

    const globalKey =
      this.cacheKeysService.getGlobalApiPermissionsMetadataKey();

    map.set(globalKey, {});

    data.forEach((p) => {
      const { application, permissionAssignmentRules, ...permission } = p;

      if (!application?.clientId) {
        const record = map.get(globalKey) as Record<string, string>;

        const key = permission.name;

        const res: IApiPermissionRules = {
          ...permission,
          permissionAssignmentRules,
        };

        record[key] = JSON.stringify(res);
      } else {
        const element = this.cacheKeysService.getApplicationsApiPermissionsKey(
          application.clientId
        );

        const record = map.get(element) as Record<string, string>;

        const key = permission.name;

        const res: IApiPermissionRules = {
          ...permission,
          permissionAssignmentRules,
        };

        record[key] = JSON.stringify(res);
      }
    });

    return Array.from(map.entries()).map(([key, value]) => {
      const hashKey = key as string;
      const object = value as Record<string, string>;

      return {
        key: hashKey,
        values: Object.entries(object).map(([fieldKey, fieldValue]) => ({
          key: fieldKey,
          value: fieldValue,
        })),
      };
    }) as J;
  }

  async save<J>(data: J): Promise<void> {
    const pipeline = this.redisService.pipeline();

    this.redisService.mhsetToPipeline(pipeline, data as HashKeyValue[]);

    await pipeline.exec();
  }
}
