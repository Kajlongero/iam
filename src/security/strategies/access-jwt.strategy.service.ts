import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { JWT_CONSTANTS } from "../constants/jwt.constants";

@Injectable()
export class AccessJwtStrategyService extends PassportStrategy(
  Strategy,
  "access-jwt"
) {
  constructor(private readonly configService: ConfigService) {
    super({
      secretOrKey: JWT_CONSTANTS.RSA_PRIVATE_KEY_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
    });
  }

  validate(...args: any[]): unknown {
    return args as unknown;
  }
}
