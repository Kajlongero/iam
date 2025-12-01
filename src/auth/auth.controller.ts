import { ConfigService } from "@nestjs/config";

import { Controller, Post, Body, UseGuards } from "@nestjs/common";

import { AuthService } from "./auth.service";

import { AuthM2MOnly } from "src/security/decorators/m2m-only.decorator";

import { BruteForceGuard } from "src/security/guards/brute-force.guard";

import { LoginDto } from "./dtos/login-user.dto";
import { RegisterDto } from "./dtos/register-user.dto";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private configService: ConfigService
  ) {}

  @Post("login")
  @AuthM2MOnly()
  @UseGuards(BruteForceGuard)
  login(@Body() payload: LoginDto) {
    return this.authService.login(payload);
  }

  @Post("register")
  @AuthM2MOnly()
  register(@Body() payload: RegisterDto) {
    return this.authService.register(payload);
  }
}
