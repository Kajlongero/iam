import { Injectable, OnModuleInit } from "@nestjs/common";

import { PreloadApplicationsService } from "./providers/preload-applications.service";

import type { KeyValue } from "src/redis/interfaces/key-val.interface";

@Injectable()
export class CacheService implements OnModuleInit {
  constructor(
    private readonly preloadApplicationsService: PreloadApplicationsService
  ) {}

  async onModuleInit() {
    await Promise.all([
      this.preloadApplicationsService
        .preload()
        .then((data) =>
          this.preloadApplicationsService.save(
            this.preloadApplicationsService.format(data) as KeyValue[]
          )
        ),
    ]);
  }
}
