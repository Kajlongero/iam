import { Request } from "express";

import { ConfigService } from "@nestjs/config";
import {
  Logger,
  Injectable,
  HttpStatus,
  CanActivate,
  HttpException,
  ExecutionContext,
} from "@nestjs/common";

import { ERROR_CODES } from "src/commons/responses/http.responses";
import { RATE_LIMIT_CONSTANTS } from "../constants/rate-limit.constants";
import { GET_IP_BRUTE_FORCE_STATUS } from "src/cache/constants/lua-scripts.constants";

import { RedisService } from "src/redis/redis.service";
import { CacheKeysService } from "src/cache/providers/cache-keys.service";

@Injectable()
export class BruteForceGuard implements CanActivate {
  private readonly logger = new Logger(BruteForceGuard.name);

  private readonly BLOCK_TIME: string;
  private readonly WINDOW_TIME: string;
  private readonly MAX_ATTEMPTS: string;

  constructor(
    private readonly cfgService: ConfigService,
    private readonly redisService: RedisService,
    private readonly cacheKeysService: CacheKeysService
  ) {
    this.BLOCK_TIME = this.cfgService.getOrThrow(
      RATE_LIMIT_CONSTANTS.RATE_LIMIT_BLOCK_TIME_SECONDS
    );
    this.WINDOW_TIME = this.cfgService.getOrThrow(
      RATE_LIMIT_CONSTANTS.RATE_LIMIT_WINDOW_TIME_SECONDS
    );
    this.MAX_ATTEMPTS = this.cfgService.getOrThrow(
      RATE_LIMIT_CONSTANTS.RATE_LIMIT_MAX_ATTEMPTS
    );
  }

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req: Request = ctx.switchToHttp().getRequest();

    const xForwardedFor = req.headers["x-forwarded-for"];
    const ip = (
      Array.isArray(xForwardedFor)
        ? xForwardedFor[0]
        : xForwardedFor || req.socket.remoteAddress
    ) as string;

    const sanitizedIp = this.sanitizeIp(ip);

    const block = this.cacheKeysService.getBlockedClientsByIp(sanitizedIp);
    const attempts = this.cacheKeysService.getAttemptsOfClientByIp(sanitizedIp);

    const isBlocked = await this.redisService.eval(
      GET_IP_BRUTE_FORCE_STATUS,
      2,
      [block, attempts, this.MAX_ATTEMPTS, this.WINDOW_TIME, this.BLOCK_TIME]
    );

    if (isBlocked !== 0)
      return this.throwTooManyRequestsError(isBlocked as number);

    return true;
  }

  private throwTooManyRequestsError(retryAfter: number): never {
    throw new HttpException(
      {
        errorCode: ERROR_CODES.SECURITY_IP_BLOCKED,
        retryAfterSeconds: retryAfter,
      },
      HttpStatus.TOO_MANY_REQUESTS
    );
  }

  private sanitizeIp(ip: string): string {
    return ip.replace(/:/g, "_");
  }
}
