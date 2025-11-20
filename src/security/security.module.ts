import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { PassportModule } from "@nestjs/passport";
import { JwtModule, JwtService } from "@nestjs/jwt";

import { StringValue } from "ms";

import { JWT_TOKEN_PROVIDERS } from "./constants/provider-tokens.constants";

import {
  JWT_CONSTANTS,
  JWT_ALGORITHMS,
  JWT_SIGN_OPTIONS,
  JWT_EXPIRATION_TIMES,
} from "./constants/jwt.constants";

import { CacheModule } from "src/cache/cache.module";
import { CryptoModule } from "src/crypto/crypto.module";

import { SecurityService } from "./security.service";
import { SecurityController } from "./security.controller";
import { LocalStrategyService } from "./strategies/local.strategy.service";
import { S2sJwtStrategyService } from "./strategies/s2s-jwt.strategy.service";
import { AccessJwtStrategyService } from "./strategies/access-jwt.strategy.service";
import { RefreshJwtStrategyService } from "./strategies/refresh-jwt.strategy.service";

@Module({
  imports: [
    ConfigModule,
    JwtModule.register({}),
    PassportModule.register({
      defaultStrategy: "s2s-jwt",
    }),
    CacheModule,
    CryptoModule,
  ],
  providers: [
    ConfigService,
    LocalStrategyService,
    S2sJwtStrategyService,
    AccessJwtStrategyService,
    RefreshJwtStrategyService,
    {
      inject: [ConfigService],
      provide: JWT_TOKEN_PROVIDERS.S2S_TOKEN_PROVIDER,
      useFactory: (configService: ConfigService) => {
        const s2sTokenSecret: string = configService.getOrThrow(
          JWT_CONSTANTS.RSA_PRIVATE_KEY_SECRET
        );
        const expiresIn: StringValue = configService.getOrThrow(
          JWT_EXPIRATION_TIMES.S2S_TOKEN_EXPIRATION_TIME
        );

        const iss: string = configService.getOrThrow(JWT_SIGN_OPTIONS.ISSUER);
        const aud: string = configService.getOrThrow(JWT_SIGN_OPTIONS.AUDIENCE);

        const alg = JWT_ALGORITHMS.S2S_TOKEN;

        return new JwtService({
          privateKey: s2sTokenSecret,
          signOptions: {
            issuer: iss,
            audience: aud,
            algorithm: alg as "RS256",
            expiresIn,
          },
        });
      },
    },
    {
      inject: [ConfigService],
      provide: JWT_TOKEN_PROVIDERS.ACCESS_TOKEN_PROVIDER,
      useFactory: (configService: ConfigService) => {
        const accessTokenSecret: string = configService.getOrThrow(
          JWT_CONSTANTS.RSA_PRIVATE_KEY_SECRET
        );
        const expiresIn: StringValue = configService.getOrThrow(
          JWT_EXPIRATION_TIMES.ACCESS_TOKEN_EXPIRATION_TIME
        );

        const iss: string = configService.getOrThrow(JWT_SIGN_OPTIONS.ISSUER);
        const aud: string = configService.getOrThrow(JWT_SIGN_OPTIONS.AUDIENCE);

        const alg = JWT_ALGORITHMS.ACCESS_TOKEN;

        return new JwtService({
          privateKey: accessTokenSecret,
          signOptions: {
            issuer: iss,
            audience: aud,
            algorithm: alg as "RS256",
            expiresIn,
          },
        });
      },
    },
    {
      inject: [ConfigService],
      provide: JWT_TOKEN_PROVIDERS.REFRESH_TOKEN_PROVIDER,
      useFactory: (configService: ConfigService) => {
        const refreshTokenSecret: string = configService.getOrThrow(
          JWT_CONSTANTS.REFRESH_TOKEN_SECRET
        );
        const expiresIn: StringValue = configService.getOrThrow(
          JWT_EXPIRATION_TIMES.REFRESH_TOKEN_EXPIRATION_TIME
        );
        const iss: string = configService.getOrThrow(JWT_SIGN_OPTIONS.ISSUER);
        const aud: string = configService.getOrThrow(JWT_SIGN_OPTIONS.AUDIENCE);

        const alg = JWT_ALGORITHMS.REFRESH_TOKEN;

        return new JwtService({
          secret: refreshTokenSecret,
          signOptions: {
            issuer: iss,
            audience: aud,
            algorithm: alg as "HS256",
            expiresIn,
          },
        });
      },
    },
    SecurityService,
  ],
  exports: [
    JwtModule,
    PassportModule,
    LocalStrategyService,
    S2sJwtStrategyService,
    AccessJwtStrategyService,
    RefreshJwtStrategyService,
    JWT_TOKEN_PROVIDERS.S2S_TOKEN_PROVIDER,
    JWT_TOKEN_PROVIDERS.ACCESS_TOKEN_PROVIDER,
    JWT_TOKEN_PROVIDERS.REFRESH_TOKEN_PROVIDER,
  ],
  controllers: [SecurityController],
})
export class SecurityModule {}
