import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { SecurityModule } from "./security/security.module";

@Module({
  imports: [ConfigModule.forRoot({ cache: true }), SecurityModule],
  providers: [],
  controllers: [],
})
export class AppModule {}
