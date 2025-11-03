import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AuthModule } from "./auth/auth.module";
import { SecurityModule } from "./security/security.module";

@Module({
  imports: [ConfigModule.forRoot({ cache: true }), SecurityModule, AuthModule],
  providers: [],
  controllers: [],
})
export class AppModule {}
