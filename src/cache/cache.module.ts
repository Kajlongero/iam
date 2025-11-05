import { Module } from "@nestjs/common";
import { CacheModule as NestCacheModule } from "@nestjs/cache-manager";

import { PrismaModule } from "src/prisma/prisma.module";

import { CacheService } from "./cache.service";
import { PreloadRolesService } from "./providers/preload-roles.service";
import { PreloadSystemsService } from "./providers/preload-systems.service";
import { PreloadPermissionsService } from "./providers/preload-permissions.service";
import { PreloadObjectMethodsService } from "./providers/preload-object-methods.service";
import { DataStructuresModule } from "src/data-structures/data-structures.module";

@Module({
  imports: [
    NestCacheModule.register({ nonBlocking: true }),
    PrismaModule,
    DataStructuresModule,
  ],
  providers: [
    CacheService,
    PreloadRolesService,
    PreloadSystemsService,
    PreloadPermissionsService,
    PreloadObjectMethodsService,
  ],
  exports: [NestCacheModule, CacheService],
})
export class CacheModule {}
