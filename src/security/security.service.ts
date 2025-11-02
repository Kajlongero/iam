import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { importSPKI, exportJWK, JWK } from "jose";

import { JWT_ALGORITHMS, JWT_CONSTANTS } from "./constants/jwt.constants";

@Injectable()
export class SecurityService implements OnModuleInit {
  private jwks: JWK | null = null;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const publicKeyPem: string = this.configService.getOrThrow(
      JWT_CONSTANTS.RSA_PUBLIC_KEY_SECRET
    );

    try {
      const key = await importSPKI(publicKeyPem, JWT_ALGORITHMS.ACCESS_TOKEN);
      const jwk = await exportJWK(key);

      this.jwks = {
        ...jwk,
        kid: "1",
        use: "sig",
        alg: JWT_ALGORITHMS.ACCESS_TOKEN,
      };
    } catch {
      throw new Error("Error loading the public key");
    }
  }

  getJwks() {
    return {
      keys: [this.jwks],
    };
  }
}
