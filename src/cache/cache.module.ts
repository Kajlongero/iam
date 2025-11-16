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

@Module({
  exports: [CacheService],
  imports: [ConfigModule, PrismaModule, RedisModule, DataStructuresModule],
  providers: [
    RedisService,
    CacheService,
    CacheKeysService,
    PreloadRolesService,
    PreloadApplicationsService,
    PreloadObjectMethodsService,
  ],
})
export class CacheModule {}
