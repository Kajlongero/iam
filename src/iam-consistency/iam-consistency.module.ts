import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DiscoveryModule } from "@nestjs/core";

import { CacheModule } from "src/cache/cache.module";

import { IamConsistencyService } from "./iam-consistency.service";

@Module({
  imports: [ConfigModule, DiscoveryModule, CacheModule],
  providers: [IamConsistencyService],
})
export class IamConsistencyModule {}
