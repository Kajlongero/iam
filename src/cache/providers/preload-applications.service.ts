import { Injectable } from "@nestjs/common";

import { RedisService } from "src/redis/redis.service";
import { PrismaService } from "src/prisma/prisma.service";
import { CacheKeysService } from "./cache-keys.service";

import type { KeyValue } from "src/redis/interfaces/key-val.interface";

import type { Application } from "generated/prisma";
import type { CachePreloader } from "../interfaces/preloaders.interface";

@Injectable()
export class PreloadApplicationsService implements CachePreloader<Application> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,

    private readonly cacheKeysService: CacheKeysService
  ) {}

  async preload(): Promise<Application[]> {
    const applications = await this.prisma.application.findMany({});

    return applications;
  }

  format(data: Application[]): KeyValue[] | Application[] {
    const mapped: KeyValue[] = data.map((app) => {
      return {
        key: this.cacheKeysService.getApplicationsKey(app.clientId),
        value: JSON.stringify({
          id: app.id,
          name: app.name,
          clientId: app.clientId,
          clientSecret: app.clientSecret,
          statusId: app.statusId,
          creatorUserId: app.creatorUserId,
          createdAt: app.createdAt,
          deletedAt: app.deletedAt,
        }),
      };
    });

    const globalApplications: KeyValue = {
      key: this.cacheKeysService.getGlobalApplicationsKey(),
      value: JSON.stringify(data),
    };

    mapped.push(globalApplications);

    return mapped;
  }

  async save(args: KeyValue[]): Promise<void> {
    await this.redisService.pipeline(args);
  }
}
