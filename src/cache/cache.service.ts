import { Injectable, OnModuleInit } from "@nestjs/common";

import { PreloadApplicationsService } from "./providers/preload-applications.service";
import { PreloadObjectMethodsService } from "./providers/preload-object-methods.service";

import type { Application } from "generated/prisma";

@Injectable()
export class CacheService implements OnModuleInit {
  constructor(
    private readonly preloadApplicationsService: PreloadApplicationsService,
    private readonly preloadObjectMethodsService: PreloadObjectMethodsService
  ) {}

  async onModuleInit() {
    await Promise.all([
      this.preloadApplicationsService
        .preload()
        .then((data) =>
          this.preloadApplicationsService.save(
            this.preloadApplicationsService.format(data as Application[])
          )
        ),
      this.preloadObjectMethodsService
        .preload()
        .then((data) =>
          this.preloadObjectMethodsService.save(
            this.preloadObjectMethodsService.format(data)
          )
        ),
    ]);
  }
}
