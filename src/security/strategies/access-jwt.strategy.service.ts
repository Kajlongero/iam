import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { JWT_CONSTANTS, JWT_EXTRACT_FIELDS } from "../constants/jwt.constants";

@Injectable()
export class AccessJwtStrategyService extends PassportStrategy(
  Strategy,
  "access-jwt"
) {
  constructor(private readonly configService: ConfigService) {
    super({
      secretOrKey: JWT_CONSTANTS.RSA_PUBLIC_KEY_SECRET,
      jwtFromRequest: ExtractJwt.fromHeader(
        JWT_EXTRACT_FIELDS.ACCESS_TOKEN.HEADER
      ),
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  validate(...args: any[]): unknown {
    return args as unknown;
  }
}
