import { Module } from "@nestjs/common";

import { PrismaModule } from "src/prisma/prisma.module";
import { SecurityModule } from "src/security/security.module";

import { AuthService } from "./auth.service";

import { AuthController } from "./auth.controller";
@Module({
  imports: [PrismaModule, SecurityModule],
  exports: [AuthService],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
