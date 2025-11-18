import { Injectable } from "@nestjs/common";

import { RedisService } from "src/redis/redis.service";
import { PrismaService } from "src/prisma/prisma.service";
import { CacheKeysService } from "./cache-keys.service";

import type { CachePreloader } from "../interfaces/preloaders.interface";

import type { Application, Permission, Role } from "generated/prisma";
import { HashKeyValue } from "src/redis/interfaces/hash.interface";

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
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
    private readonly cacheKeysService: CacheKeysService
  ) {}

  async preload(): Promise<IPermissionRules[]> {
    const data = await this.prisma.permission.findMany({
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
    });

    return data as IPermissionRules[];
  }

  format<J>(data: IPermissionRules[]): J {
    const map = new Map();
    const globalKey =
      this.cacheKeysService.getGlobalUserPermissionsMetadataKey();

    map.set(globalKey, {});

    data.forEach((p) => {
      const {
        application,
        permissionAssignmentRules,
        roleAuthorityRestrictions,
        ...permission
      } = p;

      if (!application?.clientId) {
        const record = map.get(globalKey) as Record<string, string>;

        const key =
          this.cacheKeysService.getGlobalUserPermissionsMetadataByNameKey(
            permission.name
          );

        const res: IPermissionRules = {
          ...permission,
          permissionAssignmentRules,
          roleAuthorityRestrictions,
        };

        record[key] = JSON.stringify(res);
      } else {
        const element = this.cacheKeysService.getApplicationsUserPermissionsKey(
          application.clientId
        );

        const record = map.get(element) as Record<string, string>;

        const key =
          this.cacheKeysService.getApplicationsUserPermissionsByNameKey(
            application.clientId,
            permission.name
          );

        const res: IPermissionRules = {
          ...permission,
          permissionAssignmentRules,
          roleAuthorityRestrictions,
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
