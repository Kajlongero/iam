import { Reflector } from "@nestjs/core";
import { Injectable } from "@nestjs/common";

import type { CanActivate, ExecutionContext } from "@nestjs/common";

import { AuthM2MGuard } from "./m2m-auth.guard";
import { AuthUserGuard } from "./user-auth.guad";

import { PUBLIC_ROUTE_KEY } from "src/security/decorators/public-route.decorator";
import { AUTH_M2M_ONLY_KEY } from "src/security/decorators/m2m-only.decorator";
import { Request } from "express";

@Injectable()
export class AuthGlobalGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,

    private readonly authM2mGuard: AuthM2MGuard,
    private readonly authUserGuard: AuthUserGuard
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      PUBLIC_ROUTE_KEY,
      [context.getHandler(), context.getClass()]
    );
    if (isPublic) return true;

    const isM2MOnly = this.reflector.getAllAndOverride<boolean>(
      AUTH_M2M_ONLY_KEY,
      [context.getHandler(), context.getClass()]
    );

    await this.authM2mGuard.canActivate(context);

    if (isM2MOnly) return true;

    await this.authUserGuard.canActivate(context);

    return true;
  }
}
