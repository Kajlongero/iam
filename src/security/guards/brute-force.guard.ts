import { Request } from "express";

import { ConfigService } from "@nestjs/config";
import {
  Logger,
  Injectable,
  HttpStatus,
  CanActivate,
  HttpException,
  ExecutionContext,
  ServiceUnavailableException,
} from "@nestjs/common";

import { RATE_LIMIT_CONSTANTS } from "../constants/rate-limit.constants";

import { RedisService } from "src/redis/redis.service";
import { CacheKeysService } from "src/cache/providers/cache-keys.service";

@Injectable()
export class BruteForceGuard implements CanActivate {
  private readonly logger = new Logger(BruteForceGuard.name);

  private readonly BLOCK_TIME: number;
  private readonly WINDOW_TIME: number;
  private readonly MAX_ATTEMPTS: number;

  constructor(
    private readonly cfgService: ConfigService,
    private readonly redisService: RedisService,
    private readonly cacheKeysService: CacheKeysService
  ) {
    this.BLOCK_TIME = parseInt(
      this.cfgService.getOrThrow(
        RATE_LIMIT_CONSTANTS.RATE_LIMIT_BLOCK_TIME_SECONDS
      )
    );
    this.WINDOW_TIME = parseInt(
      this.cfgService.getOrThrow(
        RATE_LIMIT_CONSTANTS.RATE_LIMIT_WINDOW_TIME_SECONDS
      )
    );
    this.MAX_ATTEMPTS = parseInt(
      this.cfgService.getOrThrow(RATE_LIMIT_CONSTANTS.RATE_LIMIT_MAX_ATTEMPTS)
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

    const blockKey = this.cacheKeysService.getBlockedClientsByIp(ip);
    const attemptsKey = this.cacheKeysService.getAttemptsOfClientByIp(ip);

    await this.isBlocked(blockKey);

    await this.checkAttempts(attemptsKey, blockKey, ip);

    return true;
  }

  private async isBlocked(blockKey: string) {
    const pipeline = this.redisService.pipeline();

    pipeline.get(blockKey);
    pipeline.ttl(blockKey);

    const results = await pipeline.exec();
    if (!results) throw new ServiceUnavailableException();

    const [[blockErr, isBlocked], [ttlErr, ttl]] = results;

    if (ttlErr || blockErr) throw new ServiceUnavailableException();

    if (isBlocked) {
      const timeLeft = typeof ttl === "number" && ttl > 0 ? ttl : 60;
      this.throwTooManyRequestsError(timeLeft);
    }
  }

  private async checkAttempts(
    attemptsKey: string,
    blockKey: string,
    ip: string
  ) {
    const pipeline = this.redisService.pipeline();

    pipeline.incr(attemptsKey);
    pipeline.ttl(attemptsKey);

    const results = await pipeline.exec();
    if (!results) throw new ServiceUnavailableException();

    const [[incrErr, attempts], [, ttl]] = results;

    if (incrErr) throw new ServiceUnavailableException();

    const currentAttempts = attempts as number;
    const currentTtl = ttl as number;

    if (currentAttempts === 1 || currentTtl === -1)
      await this.redisService.expire(attemptsKey, this.WINDOW_TIME);

    if (currentAttempts > this.MAX_ATTEMPTS)
      await this.blockIp(attemptsKey, blockKey, ip);
  }

  private async blockIp(attemptsKey: string, blockKey: string, ip: string) {
    const blockPipeline = this.redisService.pipeline();

    blockPipeline.unlink(attemptsKey).set(blockKey, 1, "EX", this.BLOCK_TIME);

    await this.redisService.execPipeline(blockPipeline);

    this.logger.warn(`🚨 IP ${ip} blocked due to brute force.`);

    this.throwTooManyRequestsError(this.BLOCK_TIME);
  }

  private throwTooManyRequestsError(retryAfter: number): never {
    throw new HttpException(
      {
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        message: "Too Many Requests. Blocked temporarily",
        errorCode: "SECURITY_IP_BLOCKED",
        retryAfterSeconds: retryAfter,
      },
      HttpStatus.TOO_MANY_REQUESTS
    );
  }
}
