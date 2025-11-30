import { Reflector } from "@nestjs/core";

import { ConfigService } from "@nestjs/config";

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";

import { CanActivate, ExecutionContext } from "@nestjs/common";

import {
  IAMMethodKey,
  IAMObjectKey,
} from "../decorators/object-method.decorator";

import { ERROR_CODES } from "src/commons/responses/http.responses";
import { IAM_CONSTANTS_ENVS } from "../constants/iam.constants";

import { RedisService } from "src/redis/redis.service";
import { CacheKeysService } from "src/cache/providers/cache-keys.service";

import type { Method, Object } from "generated/prisma";

const META_OBJECT_KEY = "__meta";

@Injectable()
export class ValidateObjectMethodAccessGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly cfgService: ConfigService,
    private readonly redisService: RedisService,
    private readonly cacheKeysService: CacheKeysService
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const targetClass = ctx.getClass();
    const targetMthd = ctx.getHandler();

    const objectName =
      this.reflector.get<string>(IAMObjectKey, targetClass) || targetClass.name;
    const methodName =
      this.reflector.get<string>(IAMMethodKey, targetMthd) || targetMthd.name;

    const IAM_CORE_SLUG = this.cfgService.getOrThrow<string>(
      IAM_CONSTANTS_ENVS.IAM_CORE_SLUG
    );

    const OBJECT_KEY = this.cacheKeysService.getApplicationsObjectKey(
      IAM_CORE_SLUG,
      objectName
    );

    const [object, method] = await this.redisService.hmget<[string, string]>(
      OBJECT_KEY,
      [META_OBJECT_KEY, methodName]
    );

    if (!object || !method)
      throw new NotFoundException(ERROR_CODES.SECURITY_RESOURCE_NOT_FOUND);

    const objectParsed = JSON.parse(object) as Object;
    const methodParsed = JSON.parse(method) as Method;

    if (!objectParsed.isActive)
      throw new ForbiddenException({
        resource: objectParsed.name,
        errorCode: ERROR_CODES.SECURITY_RESOURCE_DISABLED,
      });

    if (!methodParsed.isActive)
      throw new ForbiddenException({
        resource: methodParsed.name,
        errorCode: ERROR_CODES.SECURITY_RESOURCE_DISABLED,
      });

    return true;
  }
}
