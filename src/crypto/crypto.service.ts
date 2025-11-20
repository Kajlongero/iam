import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import {
  Options,
  argon2id,
  hash as argonHash,
  verify as argonVerify,
} from "argon2";

import { CRYPTO_HASH_CONSTANTS } from "./constants/crypto.constants";

@Injectable()
export class CryptoService {
  constructor(private readonly configService: ConfigService) {}

  async hashPassword(password: string) {
    return this.argonWrapper(password, {
      type: argon2id,
      timeCost: parseInt(
        this.configService.getOrThrow(
          CRYPTO_HASH_CONSTANTS.USER_CRYPTO_TIME_COST
        )
      ),
      memoryCost: parseInt(
        this.configService.getOrThrow(
          CRYPTO_HASH_CONSTANTS.USER_CRYPTO_MEMORY_COST
        )
      ),
      parallelism: 1,
    });
  }

  async hashMachinePassword(password: string) {
    return this.argonWrapper(password, {
      type: argon2id,
      timeCost: parseInt(
        this.configService.getOrThrow(
          CRYPTO_HASH_CONSTANTS.MACHINE_CRYPTO_TIME_COST
        )
      ),
      memoryCost: parseInt(
        this.configService.getOrThrow(
          CRYPTO_HASH_CONSTANTS.MACHINE_CRYPTO_MEMORY_COST
        )
      ),
      parallelism: 1,
    });
  }

  async argonCompare(plain: string, hash: string): Promise<boolean> {
    try {
      return await argonVerify(hash, plain);
    } catch {
      return false;
    }
  }

  private async argonWrapper(plain: string, options: Options): Promise<string> {
    try {
      return await argonHash(plain, options);
    } catch {
      throw new InternalServerErrorException("Error hashing data");
    }
  }
}
