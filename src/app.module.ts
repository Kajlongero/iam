import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ConfigModule } from "@nestjs/config";

import { AuthModule } from "./auth/auth.module";
import { CacheModule } from "./cache/cache.module";
import { CryptoModule } from "./crypto/crypto.module";
import { SecurityModule } from "./security/security.module";

import { ValidateObjectMethodAccessGuard } from "./security/guards/validate-object-method-access.guard";
import { IamConsistencyModule } from "./iam-consistency/iam-consistency.module";

@Module({
  imports: [
    ConfigModule.forRoot({ cache: true }),
    AuthModule,
    CacheModule,
    CryptoModule,
    SecurityModule,
    IamConsistencyModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ValidateObjectMethodAccessGuard,
    },
  ],
})
export class AppModule {}
