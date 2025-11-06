import { Injectable, Inject, OnModuleInit } from "@nestjs/common";

import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";

import { SYSTEMS_TOKEN } from "./tokens";

import { PreloadRolesService } from "./providers/preload-roles.service";
import { PreloadSystemsService } from "./providers/preload-systems.service";
import { PreloadPermissionsService } from "./providers/preload-permissions.service";
import { PreloadObjectMethodsService } from "./providers/preload-object-methods.service";
import { IAM } from "./interfaces/cache.interface";

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

  async getSystems(): Promise<IAM> {
    return (await this.cacheManager.get<IAM>(SYSTEMS_TOKEN)) as IAM;
  }

  async getSystemByClientId(clientId: string) {
    return (await this.getSystems()).get(clientId);
  }

  async getClientSystemRoles(clientId: string) {
    return (await this.getSystemByClientId(clientId))?.roles;
  }

  async getClientSystemRoleByName(clientId: string, roleName: string) {
    return (await this.getClientSystemRoles(clientId))?.get(roleName);
  }

  async getClientSystemPermissions(clientId: string) {
    return (await this.getSystemByClientId(clientId))?.permissions;
  }

  async getClientSystemObjectsAndMethods(clientId: string) {
    return (await this.getSystemByClientId(clientId))?.objects;
  }

  async getClientSystemRolesHierarchy(clientId: string) {
    return (await this.getSystemByClientId(clientId))?.rolesHierarchy;
  }
}
