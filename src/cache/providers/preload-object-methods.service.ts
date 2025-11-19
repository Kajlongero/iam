import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { getChunkedData } from "src/prisma/utils/batch-preloader";

import { RedisService } from "src/redis/redis.service";
import { PrismaService } from "src/prisma/prisma.service";
import { CacheKeysService } from "./cache-keys.service";

import type { CachePreloader } from "../interfaces/preloaders.interface";

import type { Application } from "generated/prisma";
import type { HashKeyValue } from "src/redis/interfaces/hash.interface";

import type { IObjectMethod } from "../interfaces/objects.interface";

interface IApplicationObjectMethod extends IObjectMethod {
  application: Pick<Application, "clientId">;
}

@Injectable()
export class PreloadObjectMethodsService
  implements CachePreloader<IApplicationObjectMethod>
{
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
    private readonly cacheKeysService: CacheKeysService
  ) {}

  async preload(): Promise<IApplicationObjectMethod[]> {
    await getChunkedData({
      limit: parseInt(this.config.getOrThrow("BATCH_PREFETCH_SIZE")),
      fnOpts: {
        include: {
          application: {
            select: {
              clientId: true,
            },
          },
          methods: true,
        },
      },
      cursorField: "id",
      fn: (args: object) => this.prisma.object.findMany(args),
      fnSave: (data: IApplicationObjectMethod[]) =>
        this.save(this.format(data)),
    });

    return [];
  }

  format<J>(data: IApplicationObjectMethod[]): J {
    const map = new Map();

    data.forEach((item) => {
      const { application, methods, ...rest } = item;

      const key = this.cacheKeysService.getApplicationsObjectKey(
        application.clientId,
        rest.name
      );

      const obj = {
        __meta: JSON.stringify(rest),
      };

      methods.forEach((method) => {
        const keyName = method.name;

        obj[keyName] = JSON.stringify(method);
      });

      if (!map.has(key)) map.set(key, obj);
    });

    return Array.from(map.entries()).map(([key, value]) => {
      const values = Object.entries(value as Record<string, unknown>);
      const keyName = key as string;

      return {
        key: keyName,
        values: values.map(([fieldKey, fieldValue]) => ({
          key: fieldKey,
          value: fieldValue,
        })),
      };
    }) as J;
  }

  async save<T>(args: T): Promise<void> {
    const pipeline = this.redisService.pipeline();

    this.redisService.mhsetToPipeline(pipeline, args as HashKeyValue[]);

    await pipeline.exec();
  }
}
