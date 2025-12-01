import { Module } from "@nestjs/common";

import { ConfigModule } from "@nestjs/config";

import { PrismaModule } from "src/prisma/prisma.module";
import { CacheModule } from "src/cache/cache.module";
import { SecurityModule } from "src/security/security.module";

import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";

import { AuthM2MGuard } from "./guards/m2m-auth.guard";
import { AuthUserGuard } from "./guards/user-auth.guad";

import { AuthGlobalGuard } from "./guards/global-auth.guard";

@Module({
  imports: [ConfigModule, PrismaModule, CacheModule, SecurityModule],
  exports: [AuthService, AuthM2MGuard, AuthUserGuard, AuthGlobalGuard],
  providers: [AuthService, AuthM2MGuard, AuthUserGuard, AuthGlobalGuard],
  controllers: [AuthController],
})
export class AuthModule {}
