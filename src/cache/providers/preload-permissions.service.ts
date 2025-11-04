import { Injectable, Inject } from "@nestjs/common";

import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";

import { SYSTEMS_TOKEN } from "../tokens";

import { PrismaService } from "src/prisma/prisma.service";

import type { Systems } from "generated/prisma";
import type { CachePreloader } from "../interfaces/preloaders.interface";
import type { IAM, IPermissionsScope } from "../interfaces/cache.interface";

interface IPermissionSystemScope extends IPermissionsScope {
  system: Pick<Systems, "clientId">;
}

@Injectable()
export class PreloadPermissionsService
  implements CachePreloader<IPermissionSystemScope>
{
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,

    private readonly prisma: PrismaService
  ) {}

  async preload(): Promise<IPermissionSystemScope[]> {
    const data = await this.prisma.permissions.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        isEditable: true,
        isGlobal: true,
        system: {
          select: {
            clientId: true,
          },
        },
        permissionAssignmentRule: {
          select: {
            role: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return data as IPermissionSystemScope[];
  }

  async format(data: IPermissionSystemScope[]): Promise<void> {
    const systems = await this.cacheManager.get<IAM>(SYSTEMS_TOKEN);

    data.forEach((d) => {
      const { system, minimumRole, ...permission } = d;

      if (!systems?.has(system.clientId)) return;

      const systemCache = systems.get(system.clientId);
      if (!systemCache?.permissions) systemCache!.permissions = new Map();

      const permissions = systemCache?.permissions;

      permissions?.set(permission.name, {
        ...permission,
        minimumRole,
      });
    });
  }
}
