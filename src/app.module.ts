import { Module } from "@nestjs/common";
import { SecurityModule } from './security/security.module';

@Module({
  imports: [SecurityModule],
  providers: [],
  controllers: [],
})
export class AppModule {}
