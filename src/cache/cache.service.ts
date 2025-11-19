import { Injectable, OnModuleInit } from "@nestjs/common";

import type { Callback } from "ioredis";

import { RedisService } from "src/redis/redis.service";
import { PreloadRolesService } from "./providers/preload-roles.service";
import { PreloadApplicationsService } from "./providers/preload-applications.service";
import { PreloadObjectMethodsService } from "./providers/preload-object-methods.service";
import { PreloadApiPermissionsService } from "./providers/preload-resource-server-permissions.service";
import { PreloadUserPermissionsService } from "./providers/preload-user-permissions.service";

import type { CacheGetterSetters } from "./interfaces/cache-getters-setters.interface";

@Injectable()
export class CacheService implements OnModuleInit, CacheGetterSetters {
  constructor(
    private readonly redisService: RedisService,
    private readonly preloadRolesService: PreloadRolesService,
    private readonly preloadApplicationsService: PreloadApplicationsService,
    private readonly preloadObjectMethodsService: PreloadObjectMethodsService,
    private readonly preloadApiPermissionsService: PreloadApiPermissionsService,
    private readonly preloadUserPermissionsService: PreloadUserPermissionsService
  ) {}

  async onModuleInit() {
    await Promise.all([
      this.preloadRolesService.preload(),
      this.preloadApplicationsService.preload(),
      this.preloadObjectMethodsService.preload(),
      this.preloadApiPermissionsService.preload(),
      this.preloadUserPermissionsService.preload(),
    ]);
  }

  async get<T>(key: string, cb?: Callback<string | null>): Promise<T> {
    const data = await this.redisService.get<T>(key, cb);

    return data;
  }

  async mget<T>(keys: string[]): Promise<T[]> {
    const data = await this.redisService.mget<T>(keys);

    return data as T[];
  }

  async hget<T>(key: string, field: string, cb?: Callback<string | null>) {
    const data = await this.redisService.hget<T>(key, field, cb);

    return data;
  }

  async hmget<T>(key: string, fields: string[]) {
    const data = await this.redisService.hmget<T>(key, fields);

    return data;
  }

  async hgetall<T>(key: string) {
    const data = await this.redisService.hgetall<T>(key);

    return data;
  }
}
