import { Injectable, OnModuleInit } from "@nestjs/common";

import { PreloadRolesService } from "./providers/preload-roles.service";
import { PreloadResourceServers } from "./providers/preload-resource-servers.service";
import { PreloadApplicationsService } from "./providers/preload-applications.service";
import { PreloadObjectMethodsService } from "./providers/preload-object-methods.service";
import { PreloadApiPermissionsService } from "./providers/preload-resource-server-permissions.service";
import { PreloadUserPermissionsService } from "./providers/preload-user-permissions.service";

@Injectable()
export class CacheService implements OnModuleInit {
  constructor(
    private readonly preloadRolesService: PreloadRolesService,
    private readonly preloadResourceServers: PreloadResourceServers,
    private readonly preloadApplicationsService: PreloadApplicationsService,
    private readonly preloadObjectMethodsService: PreloadObjectMethodsService,
    private readonly preloadApiPermissionsService: PreloadApiPermissionsService,
    private readonly preloadUserPermissionsService: PreloadUserPermissionsService
  ) {}

  async onModuleInit() {
    await Promise.all([
      this.preloadRolesService.preload(),
      this.preloadResourceServers.preload(),
      this.preloadApplicationsService.preload(),
      this.preloadObjectMethodsService.preload(),
      this.preloadApiPermissionsService.preload(),
      this.preloadUserPermissionsService.preload(),
    ]);
  }
}
