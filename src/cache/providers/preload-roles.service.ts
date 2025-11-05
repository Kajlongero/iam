import { Injectable, Inject } from "@nestjs/common";

import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";

import { SYSTEMS_TOKEN } from "../tokens";

import { PrismaService } from "src/prisma/prisma.service";
import {
  GeneralTreeService,
  TreeNode,
} from "src/data-structures/providers/general-tree.service";

import type { Systems } from "generated/prisma";
import type { CachePreloader } from "../interfaces/preloaders.interface";
import type { IAM, IUserRoles } from "../interfaces/cache.interface";

interface IRoleSystemScope extends IUserRoles {
  system: Pick<Systems, "clientId">;
}

@Injectable()
export class PreloadRolesService implements CachePreloader<IRoleSystemScope> {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,

    private readonly prisma: PrismaService,
    private readonly generalTreeService: GeneralTreeService
  ) {}

  async preload(): Promise<IRoleSystemScope[]> {
    const data = await this.prisma.roles.findMany({
      select: {
        id: true,
        name: true,
        isDefault: true,
        description: true,
        parentRoleId: true,
        system: {
          select: {
            clientId: true,
          },
        },
      },
    });

    return data as IRoleSystemScope[];
  }

  async format(data: IRoleSystemScope[]): Promise<void> {
    const system = (await this.cacheManager.get(SYSTEMS_TOKEN)) as IAM;

    data.forEach((r) => {
      const systemMap = system?.get(r.system.clientId);
      if (!systemMap) return;

      const rolesMap = systemMap.roles;
      if (!rolesMap) systemMap.roles = new Map();

      rolesMap.set(r.name, r);
    });

    this.buildRolesTree(system);
  }

  private buildRolesTree(systems: IAM) {
    systems.forEach((s) => {
      const roles = s.roles;

      const tree = this.getRoleTree(Array.from(roles.values()));

      s.rolesHierarchy = tree;
    });
  }

  private getRoleTree(roles: IUserRoles[]): TreeNode<IUserRoles> | null {
    const mapper = (item: IUserRoles) => ({
      id: item.id,
      name: item.name,
      isDefault: item.isDefault,
      description: item.description,
      parentRoleId: item.parentRoleId,
    });

    const t = this.generalTreeService.buildTree(roles, "parentRoleId", mapper);

    return t.length > 0 ? t[0] : null;
  }
}
