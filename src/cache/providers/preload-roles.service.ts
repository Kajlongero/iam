import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { getChunkedData } from "src/prisma/utils/batch-preloader";

import { RedisService } from "src/redis/redis.service";
import { PrismaService } from "src/prisma/prisma.service";
import { CacheKeysService } from "./cache-keys.service";
import { GeneralTreeService } from "src/data-structures/providers/general-tree.service";

import type { KeyValue } from "src/redis/interfaces/key-val.interface";
import type { TreeNode } from "src/data-structures/providers/general-tree.service";
import type { HashKeyValue } from "src/redis/interfaces/hash.interface";
import type { CachePreloader } from "../interfaces/preloaders.interface";
import type { Role, Application, Prisma } from "generated/prisma";

interface IApplicationRoles extends Role {
  application: Pick<Application, "clientId" | "slug">;
}

interface ApplicationRolesAndHierarchies {
  applicationRoles: HashKeyValue[];
  applicationHierarchy: KeyValue[];
}

@Injectable()
export class PreloadRolesService implements CachePreloader<IApplicationRoles> {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
    private readonly cacheKeysService: CacheKeysService,
    private readonly generalTreeService: GeneralTreeService
  ) {}

  async preload(): Promise<IApplicationRoles[]> {
    const limit = parseInt(this.config.getOrThrow("BATCH_PREFETCH_SIZE"));
    const cursorField = "id";

    const fnOpts = {
      include: {
        application: {
          select: {
            slug: true,
            clientId: true,
          },
        },
      },
    };

    await getChunkedData({
      limit,
      fnOpts,
      cursorField,

      fn: (args: Prisma.RoleFindManyArgs) => this.prisma.role.findMany(args),
      fnSave: (data: IApplicationRoles[]) => this.save(this.format(data)),
    });

    return [];
  }

  format<T>(data: IApplicationRoles[]): T {
    const rolesByCacheKey = new Map<string, Record<string, Role>>();

    const globalKeyName = this.cacheKeysService.getApplicationsGlobalRolesKey();

    data.forEach((item) => {
      const { application, ...role } = item;

      const key = application?.slug || globalKeyName;

      if (!rolesByCacheKey.has(key)) rolesByCacheKey.set(key, {});

      const record = rolesByCacheKey.get(key)!;
      record[role.name] = role;
    });

    return {
      applicationRoles: this.buildHashedRoles(rolesByCacheKey),
      applicationHierarchy: this.buildRolesTree(rolesByCacheKey),
    } as T;
  }

  async save<J>(values: J): Promise<void> {
    const pipeline = this.redisService.pipeline();

    const data = values as ApplicationRolesAndHierarchies;

    this.redisService.msetToPipeline(pipeline, data.applicationHierarchy);
    this.redisService.mhsetToPipeline(pipeline, data.applicationRoles);

    await this.redisService.execPipeline(pipeline);
  }

  /* Map
   * iam: {
   *   roleA: {
   *
   *   },
   *   roleB: {
   *
   *   },
   * }
   * global: {
   *   roleA: {
   *
   *   },
   *   roleB: {
   *
   *   },
   * }
   */

  private buildHashedRoles(map: Map<string, Record<string, Role>>) {
    return Array.from(map.entries()).map(([key, value]) => {
      const keyName = this.cacheKeysService.getApplicationsGlobalRolesKey();

      return {
        key:
          key === keyName
            ? keyName
            : this.cacheKeysService.getApplicationsLocalRolesKey(key),
        values: Object.entries(value as Record<string, unknown>).map(
          ([fieldKey, fieldValue]) => ({
            key: fieldKey,
            value: JSON.stringify(fieldValue),
          })
        ),
      };
    });
  }

  private buildRolesTree(roles: Map<string, Record<string, Role>>) {
    return Array.from(roles.entries()).map(([key, value]) => {
      const keyName = this.cacheKeysService.getApplicationsGlobalRolesKey();
      const tree = this.getRoleTree(Object.values(value));

      return {
        key:
          key === keyName
            ? this.cacheKeysService.getApplicationGlobalRolesHierarchyKey()
            : this.cacheKeysService.getApplicationsRoleHierarchyKey(key),
        value: tree ? JSON.stringify(tree) : null,
      };
    });
  }

  private getRoleTree(roles: Role[]): TreeNode<Role> | null {
    const mapper = (item: Role) => ({
      id: item.id,
      name: item.name,
      isDefault: item.isDefault,
      description: item.description,
      parentRoleId: item.parentRoleId,
    });

    const t = this.generalTreeService.buildTree(roles, "parentRoleId", mapper);

    return t.length > 0 ? (t[0] as TreeNode<Role>) : null;
  }
}
