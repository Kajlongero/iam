import { Request } from "express";

import { Injectable } from "@nestjs/common";

import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { JWT_CONSTANTS, JWT_EXTRACT_FIELDS } from "../constants/jwt.constants";

@Injectable()
export class RefreshJwtStrategyService extends PassportStrategy(
  Strategy,
  "refresh-jwt"
) {
  constructor(private readonly configService: ConfigService) {
    super({
      secretOrKey: configService.getOrThrow(JWT_CONSTANTS.REFRESH_TOKEN_SECRET),
      jwtFromRequest: ExtractJwt.fromBodyField(
        JWT_EXTRACT_FIELDS.REFRESH_TOKEN.BODY
      ),
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  validate(payload: any) {
    return payload as unknown;
  }
}
