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

import { IAM_CONSTANTS_ENVS } from "../constants/iam.constants";

import { CacheService } from "src/cache/cache.service";
import { CacheKeysService } from "src/cache/providers/cache-keys.service";

import type { Method, Object } from "generated/prisma";

const META_OBJECT_KEY = "__meta";

@Injectable()
export class ValidateObjectMethodAccessGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly cfgService: ConfigService,
    private readonly cacheService: CacheService,
    private readonly cacheKeysService: CacheKeysService
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const targetClass = ctx.getClass();
    const targetMthd = ctx.getHandler();

    const objectName =
      this.reflector.get<string>(IAMObjectKey, targetClass) || targetClass.name;
    const methodName =
      this.reflector.get<string>(IAMMethodKey, targetMthd) || targetMthd.name;

    const IAMCoreUIClientId = this.cfgService.getOrThrow<string>(
      IAM_CONSTANTS_ENVS.IAM_CORE_UI_CLIENT_ID
    );

    const OBJECT_KEY = this.cacheKeysService.getApplicationsObjectKey(
      IAMCoreUIClientId,
      objectName
    );

    const METHOD_KEY = this.cacheKeysService.getApplicationsObjectMethodKey(
      IAMCoreUIClientId,
      objectName,
      methodName
    );

    const [object, method] = await this.cacheService.hmget<[string, string]>(
      OBJECT_KEY,
      [META_OBJECT_KEY, METHOD_KEY]
    );

    if (!object || !method)
      throw new NotFoundException("Resource definition not found");

    const objectParsed = JSON.parse(object) as Object;
    const methodParsed = JSON.parse(method) as Method;

    if (!objectParsed.isActive)
      throw new ForbiddenException({
        statusCode: 403,
        message: "This resource is currently disabled by administrator",
        errorCode: "RESOURCE_DISABLED",
        resource: objectParsed.name,
      });

    if (!methodParsed.isActive)
      throw new ForbiddenException({
        statusCode: 403,
        message: "This resource is currently disabled by administrator",
        errorCode: "RESOURCE_DISABLED",
        resource: methodParsed.name,
      });

    return true;
  }
}
