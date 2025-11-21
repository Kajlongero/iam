import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import { JWT_CONSTANTS } from "../constants/jwt.constants";

@Injectable()
export class S2sJwtStrategyService extends PassportStrategy(
  Strategy,
  "s2s-jwt"
) {
  constructor(private readonly configService: ConfigService) {
    super({
      secretOrKey: configService.getOrThrow(
        JWT_CONSTANTS.RSA_PUBLIC_KEY_SECRET
      ),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  validate(payload: any) {
    return payload as unknown;
  }
}
