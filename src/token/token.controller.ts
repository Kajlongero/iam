import {
  Post,
  HttpCode,
  UseGuards,
  Controller,
  HttpStatus,
  Body,
} from "@nestjs/common";

import { TokenService } from "./token.service";

import { GetIAMResources } from "./decorators/get-resource-server.decorator";

import { ExchangeTokenDto } from "./dtos/exchange-token.dto";

import { BruteForceGuard } from "src/security/guards/brute-force.guard";
import { ValidateCredentialsExchangeTokenGuard } from "src/security/guards/validate-credentials-exchange-token.guard";

import type { ResourceServerAppSlug } from "./interfaces/exchange-token-rs-appslug-interface";

@Controller("token")
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Post("exchange")
  @HttpCode(HttpStatus.OK)
  @UseGuards(ValidateCredentialsExchangeTokenGuard)
  exchange(
    @Body() exchangeTokenDto: ExchangeTokenDto,
    @GetIAMResources("resourceServer") rs: ResourceServerAppSlug
  ) {
    return this.tokenService.exchange(exchangeTokenDto, rs);
  }

  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  refresh() {}
}
