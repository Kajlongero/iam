import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Inject, Injectable } from "@nestjs/common";

import { JWT_TOKEN_PROVIDERS } from "src/security/constants/provider-tokens.constants";

import { PrismaService } from "src/prisma/prisma.service";

import { LoginDto } from "./dtos/login-user.dto";
import { RegisterDto } from "./dtos/register-user.dto";
import { RedisService } from "src/redis/redis.service";

@Injectable()
export class AuthService {
  constructor(
    @Inject(JWT_TOKEN_PROVIDERS.ACCESS_TOKEN_PROVIDER)
    private readonly accessJwtService: JwtService,
    @Inject(JWT_TOKEN_PROVIDERS.REFRESH_TOKEN_PROVIDER)
    private readonly refreshJwtService: JwtService,

    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService
  ) {}

  login(payload: LoginDto) {
    const { email, password } = payload;
  }

  async register(payload: RegisterDto) {}
}
