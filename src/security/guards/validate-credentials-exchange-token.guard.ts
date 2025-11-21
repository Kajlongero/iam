import { Injectable } from "@nestjs/common";

import {
  ForbiddenException,
  InternalServerErrorException,
} from "@nestjs/common";

import type { Request } from "express";
import type { CanActivate, ExecutionContext } from "@nestjs/common";

import { GET_RS_VIA_MAPPED_NAME } from "src/cache/constants/lua-scripts.constants";

import { RedisService } from "src/redis/redis.service";
import { CryptoService } from "src/crypto/crypto.service";
import { CacheKeysService } from "src/cache/providers/cache-keys.service";

import type { Application } from "generated/prisma";

@Injectable()
export class ValidateCredentialsExchangeTokenGuard implements CanActivate {
  constructor(
    private readonly redisService: RedisService,
    private readonly cryptoService: CryptoService,
    private readonly cacheKeysService: CacheKeysService
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const request: Request = ctx.switchToHttp().getRequest();
    const headers = request.headers;

    let clientId: string | undefined;
    let clientSecret: string | undefined;

    const rawClientId = headers["x-client-id"];
    const rawClientSecret = headers["x-client-secret"];

    if (typeof rawClientId === "string") clientId = rawClientId;
    if (typeof rawClientSecret === "string") clientSecret = rawClientSecret;

    if (!clientId || !clientSecret)
      throw new ForbiddenException("Client ID and Secret are required");

    const key = this.cacheKeysService.getGlobalResourceServerLookupKey();

    let registry: string | null;

    try {
      registry = (await this.redisService.eval(GET_RS_VIA_MAPPED_NAME, 1, [
        key,
        clientId,
      ])) as string;
    } catch (error) {
      console.error("Redis Connection Error during S2S Auth:", error);

      throw new InternalServerErrorException(
        "Authentication service unavailable."
      );
    }

    if (!registry) throw new ForbiddenException("Invalid client credentials.");

    try {
      const app = JSON.parse(registry) as Application;

      const matches = await this.cryptoService.argonCompare(
        clientSecret,
        app.clientSecret
      );
      if (!matches) throw new ForbiddenException("Invalid client credentials.");

      // TODO: Add logging/auditing here before returning true

      request["resourceServer"] = app;

      return true;
    } catch (error) {
      if (error instanceof ForbiddenException) throw error;

      throw new ForbiddenException("Authentication validation failed.");
    }
  }
}
