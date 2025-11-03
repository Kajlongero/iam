import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AuthModule } from "./auth/auth.module";
import { SecurityModule } from "./security/security.module";
import { CacheModule } from './cache/cache.module';

@Module({
  imports: [ConfigModule.forRoot({ cache: true }), SecurityModule, AuthModule, CacheModule],
  providers: [],
  controllers: [],
})
export class AppModule {}
