import { Injectable } from "@nestjs/common";

import {
  ForbiddenException,
  InternalServerErrorException,
} from "@nestjs/common";

import type { Request } from "express";
import type { CanActivate, ExecutionContext } from "@nestjs/common";

import { ERROR_CODES } from "src/commons/responses/http.responses";
import { GET_RS_VIA_MAPPED_NAME } from "src/cache/constants/lua-scripts.constants";

import { RedisService } from "src/redis/redis.service";
import { CryptoService } from "src/crypto/crypto.service";
import { CacheKeysService } from "src/cache/providers/cache-keys.service";

import type { ResourceServer } from "generated/prisma";

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

    const rawClientId = headers["x-client-id"];
    const rawClientSecret = headers["x-client-secret"];

    const clientId = Array.isArray(rawClientId) ? rawClientId[0] : rawClientId;
    const clientSecret = Array.isArray(rawClientSecret)
      ? rawClientSecret[0]
      : rawClientSecret;

    if (!clientId || !clientSecret)
      throw new ForbiddenException(ERROR_CODES.RS_MISSING_CREDENTIALS);

    const rsLookupKey = this.cacheKeysService.getGlobalRsLookupKey();
    const appLookupKey =
      this.cacheKeysService.getGlobalApplicationSlugByRsClientIdLookupKey();

    let registry: string | null;

    try {
      registry = (await this.redisService.eval(GET_RS_VIA_MAPPED_NAME, 2, [
        rsLookupKey,
        appLookupKey,
        clientId,
      ])) as string;
    } catch (error) {
      console.error("Redis Connection Error during S2S Auth:", error);

      throw new InternalServerErrorException(
        ERROR_CODES.AUTH_SERVICE_UNAVAILABLE
      );
    }

    if (!registry)
      throw new ForbiddenException(ERROR_CODES.RS_INVALID_CREDENTIALS);

    try {
      const rs = JSON.parse(registry) as ResourceServer;

      const matches = await this.cryptoService.argonCompare(
        clientSecret,
        rs.clientSecret
      );
      if (!matches)
        throw new ForbiddenException(ERROR_CODES.RS_INVALID_CREDENTIALS);

      // TODO: Add logging/auditing here before returning true

      request["resourceServer"] = rs;

      return true;
    } catch (error) {
      if (error instanceof ForbiddenException) throw error;

      throw new ForbiddenException(ERROR_CODES.AUTH_FAILED);
    }
  }
}
