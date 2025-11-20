import { Module } from "@nestjs/common";
import { CryptoService } from "./crypto.service";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [ConfigModule],
  exports: [CryptoService],
  providers: [CryptoService],
})
export class CryptoModule {}
