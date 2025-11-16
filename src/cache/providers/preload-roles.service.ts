import { Injectable } from "@nestjs/common";

import { RedisService } from "src/redis/redis.service";
import { PrismaService } from "src/prisma/prisma.service";
import { CacheKeysService } from "./cache-keys.service";
import { GeneralTreeService } from "src/data-structures/providers/general-tree.service";

import type { KeyValue } from "src/redis/interfaces/key-val.interface";
import type { TreeNode } from "src/data-structures/providers/general-tree.service";
import type { HashKeyValue } from "src/redis/interfaces/hash.interface";
import type { CachePreloader } from "../interfaces/preloaders.interface";
import type { Role, Application } from "generated/prisma";

interface IApplicationRoles extends Role {
  application: Pick<Application, "clientId">;
}

interface ApplicationRolesAndHierarchies {
  applicationRoles: HashKeyValue[];
  applicationHierarchy: KeyValue[];
}

@Injectable()
export class PreloadRolesService implements CachePreloader<IApplicationRoles> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
    private readonly cacheKeysService: CacheKeysService,
    private readonly generalTreeService: GeneralTreeService
  ) {}

  async preload(): Promise<IApplicationRoles[]> {
    const data = await this.prisma.role.findMany({
      include: {
        application: {
          select: {
            clientId: true,
          },
        },
      },
    });

    return data as IApplicationRoles[];
  }

  format<J>(data: IApplicationRoles[]): J {
    const globalKey = this.cacheKeysService.getApplicationsGlobalRolesKey();

    const map = new Map();

    if (!map.has(globalKey)) map.set(globalKey, {});

    data.forEach((item) => {
      const { application, ...role } = item;

      if (!application?.clientId) {
        const data = map.get(globalKey) as Record<string, Role>;

        data[role.name] = role;
      } else {
        const localKey = application.clientId;
        if (!map.has(localKey)) map.set(localKey, {});

        const localData = map.get(localKey) as Record<string, Role>;

        localData[role.name] = role;
      }
    });

    const applicationRoles = this.buildHashedRoles(
      map as Map<string, Record<string, Role>>
    );

    console.log(applicationRoles);

    const applicationHierarchy = this.buildRolesTree(
      map as Map<string, Record<string, Role>>
    );

    console.log(applicationHierarchy);

    return {
      applicationRoles,
      applicationHierarchy,
    } as J;
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
