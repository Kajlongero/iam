import { Injectable, Inject, OnModuleInit } from "@nestjs/common";

import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";

import { SYSTEMS_TOKEN } from "./tokens";

import { PreloadRolesService } from "./providers/preload-roles.service";
import { PreloadSystemsService } from "./providers/preload-systems.service";
import { PreloadPermissionsService } from "./providers/preload-permissions.service";
import { PreloadObjectMethodsService } from "./providers/preload-object-methods.service";

@Injectable()
export class CacheService implements OnModuleInit {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,

    private readonly preloadSystemsService: PreloadSystemsService,
    private readonly preloadSystemsRolesService: PreloadRolesService,
    private readonly preloadSystemsPermissionsService: PreloadPermissionsService,
    private readonly preloadSystemsObjectsAndMethodsService: PreloadObjectMethodsService
  ) {}

  async onModuleInit() {
    await this.cacheManager.set(SYSTEMS_TOKEN, new Map());

    await this.preloadSystemsService
      .preload()
      .then((data) => this.preloadSystemsService.format(data));

    await Promise.all([
      this.preloadSystemsObjectsAndMethodsService
        .preload()
        .then((data) =>
          this.preloadSystemsObjectsAndMethodsService.format(data)
        ),
      this.preloadSystemsPermissionsService
        .preload()
        .then((data) => this.preloadSystemsPermissionsService.format(data)),
      this.preloadSystemsRolesService
        .preload()
        .then((data) => this.preloadSystemsRolesService.format(data)),
    ]);
  }
}
