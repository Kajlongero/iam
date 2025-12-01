import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

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

@Module({
  imports: [ConfigModule, JwtModule.register({}), CacheModule, CryptoModule],
  providers: [
    ConfigService,
    {
      inject: [ConfigService],
      provide: JWT_TOKEN_PROVIDERS.M2M_TOKEN_PROVIDER,
      useFactory: (configService: ConfigService) => {
        const rawPrivate: string = configService.getOrThrow(
          JWT_CONSTANTS.RSA_PRIVATE_KEY_SECRET
        );
        const privateKey = rawPrivate.replace(/\\n/g, "\n");

        const rawPublic = configService.getOrThrow<string>(
          JWT_CONSTANTS.RSA_PUBLIC_KEY_SECRET
        );
        const publicKey = rawPublic.replace(/\\n/g, "\n");

        const expiresIn: StringValue = configService.getOrThrow(
          JWT_EXPIRATION_TIMES.M2M_TOKEN_EXPIRATION_TIME
        );

        const iss: string = configService.getOrThrow(JWT_SIGN_OPTIONS.ISSUER);

        const alg = JWT_ALGORITHMS.M2M_TOKEN;

        return new JwtService({
          publicKey,
          privateKey,
          signOptions: {
            issuer: iss,
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
        const rawPrivate: string = configService.getOrThrow(
          JWT_CONSTANTS.RSA_PRIVATE_KEY_SECRET
        );
        const privateKey = rawPrivate.replace(/\\n/g, "\n");

        const rawPublic = configService.getOrThrow<string>(
          JWT_CONSTANTS.RSA_PUBLIC_KEY_SECRET
        );
        const publicKey = rawPublic.replace(/\\n/g, "\n");

        const expiresIn: StringValue = configService.getOrThrow(
          JWT_EXPIRATION_TIMES.M2M_TOKEN_EXPIRATION_TIME
        );

        const iss: string = configService.getOrThrow(JWT_SIGN_OPTIONS.ISSUER);

        const alg = JWT_ALGORITHMS.M2M_TOKEN;

        return new JwtService({
          publicKey,
          privateKey,
          signOptions: {
            issuer: iss,
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

        const alg = JWT_ALGORITHMS.REFRESH_TOKEN;

        return new JwtService({
          secret: refreshTokenSecret,
          signOptions: {
            issuer: iss,
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
    JWT_TOKEN_PROVIDERS.M2M_TOKEN_PROVIDER,
    JWT_TOKEN_PROVIDERS.ACCESS_TOKEN_PROVIDER,
    JWT_TOKEN_PROVIDERS.REFRESH_TOKEN_PROVIDER,
  ],
  controllers: [SecurityController],
})
export class SecurityModule {}
