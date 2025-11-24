import { Module } from "@nestjs/common";

import { ConfigModule } from "@nestjs/config";

import { RedisModule } from "src/redis/redis.module";
import { PrismaModule } from "src/prisma/prisma.module";
import { DataStructuresModule } from "src/data-structures/data-structures.module";

import { CacheService } from "./cache.service";
import { RedisService } from "src/redis/redis.service";
import { CacheKeysService } from "./providers/cache-keys.service";
import { PreloadRolesService } from "./providers/preload-roles.service";
import { PreloadApplicationsService } from "./providers/preload-applications.service";
import { PreloadObjectMethodsService } from "./providers/preload-object-methods.service";
import { PreloadUserPermissionsService } from "./providers/preload-user-permissions.service";
import { PreloadApiPermissionsService } from "./providers/preload-resource-server-permissions.service";
import { PreloadResourceServers } from "./providers/preload-resource-servers.service";
import { PreloadM2MExposedPermissionsService } from "./providers/preload-m2m-exposed-permissions.service";
import { PreloadM2MConsumptionPermissionsService } from "./providers/preload-m2m-consumption-permissions.service";

@Module({
  exports: [CacheService, CacheKeysService, RedisService],
  imports: [ConfigModule, PrismaModule, RedisModule, DataStructuresModule],
  providers: [
    RedisService,
    CacheService,
    CacheKeysService,
    PreloadRolesService,
    PreloadResourceServers,
    PreloadApplicationsService,
    PreloadObjectMethodsService,
    PreloadApiPermissionsService,
    PreloadUserPermissionsService,
    PreloadM2MExposedPermissionsService,
    PreloadM2MConsumptionPermissionsService,
  ],
})
export class CacheModule {}
