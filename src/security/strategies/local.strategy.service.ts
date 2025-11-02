import { Injectable } from "@nestjs/common";

import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";

@Injectable()
export class LocalStrategyService extends PassportStrategy(Strategy) {
  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super({
      usernameField: "email",
      passwordField: "password",
    });
  }

  validate(...args: any[]): unknown {
    return args as unknown;
  }
}
