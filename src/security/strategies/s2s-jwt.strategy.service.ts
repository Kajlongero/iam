import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class S2sJwtStrategyService extends PassportStrategy(
  Strategy,
  "s2s-jwt"
) {
  constructor() {
    super({
      secretOrKey: "s2s-secret",
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
    });
  }

  validate(payload: any) {
    return payload as unknown;
  }
}
