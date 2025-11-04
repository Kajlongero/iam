import { Inject, Injectable } from "@nestjs/common";

import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";

import { SYSTEMS_TOKEN } from "../tokens";

import { PrismaService } from "src/prisma/prisma.service";

import type { Systems } from "generated/prisma";
import type { CachePreloader } from "../interfaces/preloaders.interface";
import type { IAM, IObjects, IMethods } from "../interfaces/cache.interface";

interface IObjectMethodSystemScope extends IObjects {
  method: IMethods[];
  system: Pick<Systems, "clientId">;
}

@Injectable()
export class PreloadObjectMethodsService
  implements CachePreloader<IObjectMethodSystemScope>
{
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,

    private readonly prisma: PrismaService
  ) {}

  async preload(): Promise<IObjectMethodSystemScope[]> {
    const data = await this.prisma.objects.findMany({
      select: {
        id: true,
        name: true,
        isActive: true,
        description: true,
        method: {
          select: {
            id: true,
            name: true,
            isActive: true,
            description: true,
          },
        },
        system: {
          select: {
            clientId: true,
          },
        },
      },
    });

    return data as unknown as IObjectMethodSystemScope[];
  }

  async format(data: IObjectMethodSystemScope[]): Promise<void> {
    const systems = await this.cacheManager.get<IAM>(SYSTEMS_TOKEN);

    data.forEach((o) => {
      const { id, name, isActive, description, method, system } = o;

      const systemMap = systems?.get(system.clientId);
      if (!systemMap) return;

      const objectsAndMethods = systemMap.objects;
      if (!objectsAndMethods) systemMap.objects = new Map();

      objectsAndMethods.set(name, {
        id,
        name,
        isActive,
        description,
        methods: new Map(method.map((m) => [m.name, m])),
      });
    });
  }
}
