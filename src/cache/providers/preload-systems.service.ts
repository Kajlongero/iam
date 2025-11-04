import { Injectable, Inject } from "@nestjs/common";
import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";

import { SYSTEMS_TOKEN } from "../tokens";

import { PrismaService } from "src/prisma/prisma.service";

import type { Systems } from "generated/prisma";
import type { IAM, IAMCache } from "../interfaces/cache.interface";
import type { CachePreloader } from "../interfaces/preloaders.interface";

@Injectable()
export class PreloadSystemsService implements CachePreloader<Systems> {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,

    private readonly prisma: PrismaService
  ) {}

  async preload(): Promise<Systems[]> {
    const data = await this.prisma.systems.findMany({});

    return data;
  }

  async format(data: Systems[]) {
    const systems = await this.cacheManager.get<IAM>(SYSTEMS_TOKEN);

    data.forEach((s) => {
      const system = systems?.has(s.clientId);

      const initialState: IAMCache = {
        roles: null,
        system: s,
        objects: new Map(),
        permissions: new Map(),
      };

      if (!system) systems?.set(s.clientId, initialState);
    });
  }
}
