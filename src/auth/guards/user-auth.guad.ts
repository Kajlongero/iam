import { Request } from "express";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

import { Inject, Injectable } from "@nestjs/common";

import { UnauthorizedException } from "@nestjs/common";

import type { CanActivate, ExecutionContext } from "@nestjs/common";

import { ERROR_CODES } from "src/commons/responses/http.responses";
import { JWT_SIGN_OPTIONS } from "src/security/constants/jwt.constants";
import { IAM_CONSTANTS_ENVS } from "src/security/constants/iam.constants";
import { JWT_TOKEN_PROVIDERS } from "src/security/constants/provider-tokens.constants";

import type { JwtUserPayload } from "src/security/interfaces/jwt.payload";

interface JwtError {
  name: string;
}

@Injectable()
export class AuthUserGuard implements CanActivate {
  private EXPECTED_ISSUER: string;
  private EXPECTED_AUDIENCE: string;
  private EXPECTED_IAM_ALIAS: string;

  private readonly EXPECTED_TOKEN_TYPE: string = "user";

  constructor(
    @Inject(JWT_TOKEN_PROVIDERS.ACCESS_TOKEN_PROVIDER)
    private readonly userJwtService: JwtService,

    private readonly configService: ConfigService
  ) {
    this.EXPECTED_ISSUER = this.configService.getOrThrow<string>(
      JWT_SIGN_OPTIONS.ISSUER
    );
    this.EXPECTED_AUDIENCE = this.configService.getOrThrow<string>(
      JWT_SIGN_OPTIONS.AUDIENCE
    );
    this.EXPECTED_IAM_ALIAS = this.configService.getOrThrow<string>(
      IAM_CONSTANTS_ENVS.IAM_CORE_SYSTEM_API_RESOURCE_SERVER_NAME
    );
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromXUserToken(request);
    const decoded = await this.validateToken(token);

    request.user = decoded as JwtUserPayload;

    return true;
  }

  private async validateToken(token: string): Promise<void | JwtUserPayload> {
    try {
      const decoded: unknown = await this.userJwtService.verifyAsync(token);
      const payload = decoded as JwtUserPayload;

      this.validateClaims(payload);

      return payload;
    } catch (err: any) {
      this.jwtErrors(err as JwtError);
    }
  }

  private validateClaims(payload: JwtUserPayload) {
    if (!payload.type) throw new UnauthorizedException();

    if (payload.type !== this.EXPECTED_TOKEN_TYPE)
      throw new UnauthorizedException(
        ERROR_CODES.AUTH_INVALID_USER_TOKEN_TYPE_REQUIRED
      );

    if (payload.iss !== this.EXPECTED_ISSUER)
      throw new UnauthorizedException(ERROR_CODES.AUTH_INVALID_ISSUER);

    if (!payload.aud?.includes(this.EXPECTED_IAM_ALIAS))
      throw new UnauthorizedException(ERROR_CODES.AUTH_INVALID_AUDIENCE);

    if (!payload.aud?.includes(this.EXPECTED_AUDIENCE))
      throw new UnauthorizedException(ERROR_CODES.AUTH_INVALID_AUDIENCE);
  }

  private extractTokenFromXUserToken(req: Request) {
    const token = req.headers["x-user-token"];
    if (!token)
      throw new UnauthorizedException(ERROR_CODES.AUTH_MISSING_USER_TOKEN);

    if (typeof token !== "string")
      throw new UnauthorizedException(ERROR_CODES.AUTH_INVALID_USER_TOKEN_TYPE);

    return token;
  }

  private jwtErrors(error: JwtError) {
    switch (error.name) {
      case "TokenExpiredError":
        throw new UnauthorizedException(ERROR_CODES.AUTH_USER_TOKEN_EXPIRED);
      case "JsonWebTokenError":
        throw new UnauthorizedException(ERROR_CODES.AUTH_INVALID_USER_TOKEN);
      default:
        throw new UnauthorizedException(ERROR_CODES.AUTH_INVALID_USER_TOKEN);
    }
  }
}
