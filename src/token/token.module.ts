import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { CacheModule } from "src/cache/cache.module";
import { CryptoModule } from "src/crypto/crypto.module";

import { TokenService } from "./token.service";
import { TokenController } from "./token.controller";

@Module({
  imports: [ConfigModule, CacheModule, CryptoModule],
  providers: [TokenService],
  controllers: [TokenController],
})
export class TokenModule {}
