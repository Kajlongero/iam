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

import type { JwtM2MPayload } from "src/security/interfaces/jwt.payload";

interface JwtError {
  name: string;
}

@Injectable()
export class AuthM2MGuard implements CanActivate {
  private EXPECTED_ISSUER: string;
  private EXPECTED_AUDIENCE: string;
  private EXPECTED_IAM_ALIAS: string;

  private readonly EXPECTED_TOKEN_TYPE: string = "m2m";

  constructor(
    @Inject(JWT_TOKEN_PROVIDERS.M2M_TOKEN_PROVIDER)
    private readonly m2mJwtService: JwtService,

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

    const token = this.extractTokenFromAuthorizationHeader(request);
    const decoded = await this.validateToken(token);

    request["m2m"] = decoded;

    return true;
  }

  private async validateToken(token: string): Promise<void | JwtM2MPayload> {
    try {
      const decoded: unknown = await this.m2mJwtService.verifyAsync(token);
      const payload = decoded as JwtM2MPayload;

      this.validateClaims(payload);

      return payload;
    } catch (err: any) {
      this.jwtErrors(err as JwtError);
    }
  }

  private validateClaims(payload: JwtM2MPayload) {
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

  private extractTokenFromAuthorizationHeader(req: Request) {
    const authorization = req.headers["authorization"];
    if (!authorization)
      throw new UnauthorizedException(ERROR_CODES.AUTH_MISSING_M2M_TOKEN);

    if (typeof authorization !== "string")
      throw new UnauthorizedException(ERROR_CODES.AUTH_INVALID_M2M_TOKEN_TYPE);

    const [type, token] = authorization.split(" ");

    if (type !== "Bearer")
      throw new UnauthorizedException(ERROR_CODES.AUTH_INVALID_M2M_TOKEN_TYPE);

    return token;
  }

  private jwtErrors(error: JwtError) {
    switch (error.name) {
      case "TokenExpiredError":
        throw new UnauthorizedException(ERROR_CODES.AUTH_M2M_TOKEN_EXPIRED);
      case "JsonWebTokenError":
        throw new UnauthorizedException(ERROR_CODES.AUTH_INVALID_M2M_TOKEN);
      default:
        throw new UnauthorizedException(ERROR_CODES.AUTH_INVALID_M2M_TOKEN);
    }
  }
}
