import { Request } from "express";

import { Injectable } from "@nestjs/common";

import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { JWT_CONSTANTS } from "../constants/jwt.constants";

@Injectable()
export class RefreshJwtStrategyService extends PassportStrategy(
  Strategy,
  "refresh-jwt"
) {
  constructor(private readonly configService: ConfigService) {
    super({
      secretOrKey: configService.getOrThrow(JWT_CONSTANTS.REFRESH_TOKEN_SECRET),
      jwtFromRequest: ExtractJwt.fromBodyField("refresh_token"),
      ignoreExpiration: false,
    });
  }

  validate(payload: any) {
    return payload as unknown;
  }
}
