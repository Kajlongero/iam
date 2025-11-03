import { Body, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { LoginDto } from "./dtos/login-user.dto";

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  login(@Body() body: LoginDto) {
    return body;
  }
}
