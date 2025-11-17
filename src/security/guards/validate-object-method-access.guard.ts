import { Injectable, ServiceUnavailableException } from "@nestjs/common";

import { CanActivate, ExecutionContext } from "@nestjs/common";

import { CacheService } from "src/cache/cache.service";
import { CacheKeysService } from "src/cache/providers/cache-keys.service";

import type { Method, Object } from "generated/prisma";

const META_OBJECT_KEY = "__meta";
@Injectable()
export class ValidateObjectMethodAccessGuard implements CanActivate {
  constructor(
    private readonly cacheService: CacheService,
    private readonly cacheKeysService: CacheKeysService
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const objectName = ctx.getClass().name;
    const methodName = ctx.getHandler().name;

    const OBJECT_KEY = this.cacheKeysService.getApplicationsObjectKey(
      "IAM_CORE_UI_PLACEHOLDER",
      objectName
    );

    const METHOD_KEY = this.cacheKeysService.getApplicationsObjectMethodKey(
      "IAM_CORE_UI_PLACEHOLDER",
      objectName,
      methodName
    );

    const [object, method] = await this.cacheService.hmget<[string, string]>(
      OBJECT_KEY,
      [META_OBJECT_KEY, METHOD_KEY]
    );

    if (!object || !method) throw new ServiceUnavailableException();

    const objectParsed = JSON.parse(object) as Object;
    const methodParsed = JSON.parse(method) as Method;

    if (!objectParsed.isActive) throw new ServiceUnavailableException();
    if (!methodParsed.isActive) throw new ServiceUnavailableException();

    return true;
  }
}
