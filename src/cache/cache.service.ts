import { Injectable, OnModuleInit } from "@nestjs/common";

import { PreloadRolesService } from "./providers/preload-roles.service";
import { PreloadResourceServers } from "./providers/preload-resource-servers.service";
import { PreloadApplicationsService } from "./providers/preload-applications.service";
import { PreloadObjectMethodsService } from "./providers/preload-object-methods.service";
import { PreloadApiPermissionsService } from "./providers/preload-resource-server-permissions.service";
import { PreloadUserPermissionsService } from "./providers/preload-user-permissions.service";
import { PreloadM2MExposedPermissionsService } from "./providers/preload-m2m-exposed-permissions.service";
import { PreloadM2MConsumptionPermissionsService } from "./providers/preload-m2m-consumption-permissions.service";

@Injectable()
export class CacheService implements OnModuleInit {
  constructor(
    private readonly preloadRolesService: PreloadRolesService,
    private readonly preloadResourceServers: PreloadResourceServers,
    private readonly preloadApplicationsService: PreloadApplicationsService,
    private readonly preloadObjectMethodsService: PreloadObjectMethodsService,
    private readonly preloadApiPermissionsService: PreloadApiPermissionsService,
    private readonly preloadUserPermissionsService: PreloadUserPermissionsService,
    private readonly preloadM2MExposedPermissionsService: PreloadM2MExposedPermissionsService,
    private readonly preloadM2MConsumptionPermissionsService: PreloadM2MConsumptionPermissionsService
  ) {}

  async onModuleInit() {
    await Promise.all([
      this.preloadRolesService.preload(),
      this.preloadResourceServers.preload(),
      this.preloadApplicationsService.preload(),
      this.preloadObjectMethodsService.preload(),
      this.preloadApiPermissionsService.preload(),
      this.preloadUserPermissionsService.preload(),
      this.preloadM2MExposedPermissionsService.preload(),
      this.preloadM2MConsumptionPermissionsService.preload(),
    ]);
  }
}
