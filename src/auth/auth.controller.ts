import { Controller, Post, Body, UseGuards } from "@nestjs/common";

import { AuthService } from "./auth.service";

import { BruteForceGuard } from "src/security/guards/brute-force.guard";

import { LoginDto } from "./dtos/login-user.dto";
import { RegisterDto } from "./dtos/register-user.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @UseGuards(BruteForceGuard)
  login(@Body() payload: LoginDto) {
    return this.authService.login(payload);
  }

  @Post("register")
  register(@Body() payload: RegisterDto) {
    return this.authService.register(payload);
  }
}
