import {
  Post,
  HttpCode,
  UseGuards,
  Controller,
  HttpStatus,
} from "@nestjs/common";

import { TokenService } from "./token.service";

import { ValidateCredentialsExchangeTokenGuard } from "src/security/guards/validate-credentials-exchange-token.guard";

@Controller("token")
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Post("exchange")
  @HttpCode(HttpStatus.OK)
  @UseGuards(ValidateCredentialsExchangeTokenGuard)
  exchange() {}

  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  refresh() {}
}
