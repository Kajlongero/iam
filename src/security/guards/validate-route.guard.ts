import { Request } from "express";

import { Injectable, ServiceUnavailableException } from "@nestjs/common";

import { CanActivate, ExecutionContext } from "@nestjs/common";

import { CacheService } from "src/cache/cache.service";
import { IAM_CORE_UI_SYSTEM_NAME } from "src/cache/tokens";

@Injectable()
export class ValidateObjectMethodAccessGuard implements CanActivate {
  constructor(private readonly cacheService: CacheService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const object = ctx.getClass();
    const method = ctx.getHandler();

    const objects = await this.cacheService.getClientSystemObjectsAndMethods(
      IAM_CORE_UI_SYSTEM_NAME
    );
    if (!object) return true;

    const findObject = objects?.get(object.name);
    if (!findObject || (findObject && !findObject.isActive))
      throw new ServiceUnavailableException();

    const findMethod = findObject.methods.get(method.name);
    if (!findMethod || (findMethod && !findMethod.isActive))
      throw new ServiceUnavailableException();

    return true;
  }
}
