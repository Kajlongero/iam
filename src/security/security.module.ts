import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { PassportModule } from "@nestjs/passport";
import { JwtModule, JwtService } from "@nestjs/jwt";

import { StringValue } from "ms";

import { LocalStrategyService } from "./strategies/local.strategy.service";
import { S2sJwtStrategyService } from "./strategies/s2s-jwt.strategy.service";
import { AccessJwtStrategyService } from "./strategies/access-jwt.strategy.service";
import { RefreshJwtStrategyService } from "./strategies/refresh-jwt.strategy.service";

import { JWT_TOKEN_PROVIDERS } from "./constants/provider-tokens.constants";
import { JWT_CONSTANTS, JWT_EXPIRATION_TIMES } from "./constants/jwt.constants";

@Module({
  imports: [
    ConfigModule,
    JwtModule.register({}),
    PassportModule.register({
      defaultStrategy: "s2s-jwt",
    }),
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

        return new JwtService({
          privateKey: s2sTokenSecret,
          signOptions: {
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

        return new JwtService({
          privateKey: accessTokenSecret,
          signOptions: {
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

        return new JwtService({
          secret: refreshTokenSecret,
          signOptions: {
            expiresIn,
          },
        });
      },
    },
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
})
export class SecurityModule {}
