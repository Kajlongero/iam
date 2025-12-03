import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ConfigModule } from "@nestjs/config";
import { LoggerModule } from "nestjs-pino";
import { IamConsistencyModule } from "./iam-consistency/iam-consistency.module";

import { AuthModule } from "./auth/auth.module";
import { CacheModule } from "./cache/cache.module";
import { TokenModule } from "./token/token.module";
import { CryptoModule } from "./crypto/crypto.module";
import { SecurityModule } from "./security/security.module";

import { AuthGlobalGuard } from "./auth/guards/global-auth.guard";
import { ValidateObjectMethodAccessGuard } from "./security/guards/validate-object-method-access.guard";

@Module({
  imports: [
    LoggerModule.forRoot(),
    ConfigModule.forRoot({ cache: true }),
    AuthModule,
    CacheModule,
    TokenModule,
    CryptoModule,
    SecurityModule,
    IamConsistencyModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGlobalGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ValidateObjectMethodAccessGuard,
    },
  ],
})
export class AppModule {}
