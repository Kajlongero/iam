import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { getChunkedData } from "src/prisma/utils/batch-preloader";
import { MapToHashKeyValueArray } from "../helpers/map-to-hash-key-value";

import { RedisService } from "src/redis/redis.service";
import { PrismaService } from "src/prisma/prisma.service";
import { CacheKeysService } from "./cache-keys.service";

import type { HashKeyValue } from "src/redis/interfaces/hash.interface";
import type { IObjectMethod } from "../interfaces/objects.interface";
import type { CachePreloader } from "../interfaces/preloaders.interface";
import type { Application, Prisma } from "generated/prisma";

interface IApplicationObjectMethod extends IObjectMethod {
  application: Pick<Application, "clientId" | "slug">;
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
    const limit = parseInt(this.config.getOrThrow("BATCH_PREFETCH_SIZE"));
    const cursorField = "id";

    const fnOpts = {
      include: {
        application: {
          select: {
            slug: true,
            clientId: true,
          },
        },
        methods: true,
      },
    };

    await getChunkedData({
      limit,
      fnOpts,
      cursorField,

      fn: (args: Prisma.ObjectFindManyArgs) =>
        this.prisma.object.findMany(args),
      fnSave: (data: IApplicationObjectMethod[]) =>
        this.save(this.format(data)),
    });

    return [];
  }

  format<J>(data: IApplicationObjectMethod[]): J {
    const map = new Map<string, Record<string, string>>();

    data.forEach((item) => {
      const { application, methods, ...rest } = item;

      const key = this.cacheKeysService.getApplicationsObjectKey(
        application.slug,
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

    return MapToHashKeyValueArray(map) as J;
  }

  async save<T>(args: T): Promise<void> {
    const pipeline = this.redisService.pipeline();

    this.redisService.mhsetToPipeline(pipeline, args as HashKeyValue[]);

    await pipeline.exec();
  }
}
