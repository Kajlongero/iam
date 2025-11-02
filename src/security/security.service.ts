import { Injectable } from "@nestjs/common";

import { ConfigService } from "@nestjs/config";
import { JWT_ALGORITHMS, JWT_CONSTANTS } from "./constants/jwt.constants";

@Injectable()
export class SecurityService {
  constructor(private readonly configService: ConfigService) {}

  jwks() {
    const publicKey: string = this.configService.getOrThrow(
      JWT_CONSTANTS.RSA_PUBLIC_KEY_SECRET
    );

    return {
      keys: [
        {
          kty: "RSA",
          e: "AQAB",
          use: "sig",
          kid: "1",
          alg: JWT_ALGORITHMS.S2S_TOKEN,
          n: publicKey,
        },
      ],
    };
  }
}
