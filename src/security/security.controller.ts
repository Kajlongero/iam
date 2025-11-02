import { Controller, Get } from "@nestjs/common";

import { SecurityService } from "./security.service";

@Controller(".well-known")
export class SecurityController {
  constructor(private readonly securityService: SecurityService) {}

  @Get("jwks.json")
  jwks() {
    return this.securityService.getJwks();
  }
}
