import { Injectable, Logger, OnModuleInit } from "@nestjs/common";

import { ConfigService } from "@nestjs/config";
import { Reflector, MetadataScanner, DiscoveryService } from "@nestjs/core";

import { METHOD_METADATA, PATH_METADATA } from "@nestjs/common/constants";

import { IAM_CONSTANTS_ENVS } from "src/security/constants/iam.constants";

import { RedisService } from "src/redis/redis.service";
import { CacheKeysService } from "src/cache/providers/cache-keys.service";

import {
  IAMMethodKey,
  IAMObjectKey,
} from "src/security/decorators/object-method.decorator";

@Injectable()
export class IamConsistencyService implements OnModuleInit {
  private logger: Logger = new Logger(IamConsistencyService.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
    private readonly metadataScanner: MetadataScanner,
    private readonly cacheKeysService: CacheKeysService,
    private readonly discoveryService: DiscoveryService
  ) {}

  async onModuleInit() {
    const appSlug = this.configService.getOrThrow<string>(
      IAM_CONSTANTS_ENVS.IAM_CORE_SLUG
    );

    const controllers = this.discoveryService.getControllers();

    const missingResources = new Map<string, string[]>();

    for (const wrapper of controllers) {
      const { metatype } = wrapper;

      if (!metatype || !wrapper.instance || !wrapper.isDependencyTreeStatic())
        continue;

      const objectName =
        this.reflector.get<string>(IAMObjectKey, metatype) || metatype.name;

      const objectKey = this.cacheKeysService.getApplicationsObjectKey(
        appSlug,
        objectName
      );

      const objectExists = await this.redisService.exists(objectKey);

      if (objectExists === 0) {
        missingResources.set(objectName, []);

        continue;
      }

      const instanceRef = wrapper.instance as Record<string, unknown>;
      const methodNames = this.metadataScanner.getAllMethodNames(
        Object.getPrototypeOf(instanceRef)
      );

      for (const method of methodNames) {
        const candidate = instanceRef[method];
        if (typeof candidate !== "function") continue;

        const methodRef = candidate;

        const isEndpoint = this.isRouteHandler(methodRef as () => void);
        const hasIamDecorator: boolean = this.reflector.get(
          IAMMethodKey,
          methodRef
        );

        if (!isEndpoint && !hasIamDecorator) continue;

        const finalMethodName =
          this.reflector.get<string>(IAMMethodKey, methodRef) || method;

        const methodExists = await this.redisService.hexists(
          objectKey,
          finalMethodName
        );

        if (methodExists === 0) {
          const currentMissing = missingResources.get(objectName) || [];

          currentMissing.push(finalMethodName);
          missingResources.set(objectName, currentMissing);
        }
      }
    }

    this.logResults(missingResources);
  }

  private isRouteHandler(target: () => void): boolean {
    const path: string = this.reflector.get(PATH_METADATA, target);
    const method: string = this.reflector.get(METHOD_METADATA, target);

    return !!path || !!method;
  }

  private logResults(map: Map<string, string[]>) {
    if (map.size === 0) return;

    for (const [objectName, methods] of map) {
      if (methods.length === 0) {
        this.logger.error(`Missing ${objectName} controller will output 404`);
      } else {
        this.logger.error(`PARTIAL OBJECT ${objectName}`);

        methods.forEach((method) => {
          this.logger.error(`MISSING OBJECT ${method}`);
        });
      }
    }
  }
}
