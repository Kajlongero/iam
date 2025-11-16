import { Module } from "@nestjs/common";

import { ConfigModule } from "@nestjs/config";

import { RedisModule } from "src/redis/redis.module";
import { PrismaModule } from "src/prisma/prisma.module";

import { CacheService } from "./cache.service";
import { RedisService } from "src/redis/redis.service";
import { CacheKeysService } from "./providers/cache-keys.service";
import { PreloadApplicationsService } from "./providers/preload-applications.service";

@Module({
  exports: [CacheService],
  imports: [ConfigModule, PrismaModule, RedisModule],
  providers: [
    RedisService,
    CacheService,
    CacheKeysService,
    PreloadApplicationsService,
  ],
})
export class CacheModule {}
