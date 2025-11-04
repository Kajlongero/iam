import { Injectable, Inject } from "@nestjs/common";

import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";

@Injectable()
export class PreloadRolesService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}
}
