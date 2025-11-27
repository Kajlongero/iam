import { Request } from "express";

import { createParamDecorator, ExecutionContext } from "@nestjs/common";

type IAMResources = "application" | "resourceServer";

export const GetIAMResources = createParamDecorator(
  (data: IAMResources, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();

    if (request[data]) return request["resourceServer"] as IAMResources;
  }
);
