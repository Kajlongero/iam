import { Module } from "@nestjs/common";

import { ConfigModule } from "@nestjs/config";

import { PrismaModule } from "src/prisma/prisma.module";
import { CacheModule } from "src/cache/cache.module";
import { SecurityModule } from "src/security/security.module";

import { AuthService } from "./auth.service";

import { AuthController } from "./auth.controller";

@Module({
  imports: [ConfigModule, PrismaModule, CacheModule, SecurityModule],
  exports: [AuthService],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
