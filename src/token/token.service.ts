import { v7 as uuidv7 } from "uuid";

import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import {
  Inject,
  Injectable,
  ForbiddenException,
  BadRequestException,
} from "@nestjs/common";

import { IAM_CONSTANTS_ENVS } from "src/security/constants/iam.constants";

import { TokenM2MBuilder } from "./providers/token-m2m-builder.service";

import { RedisService } from "src/redis/redis.service";
import { CacheKeysService } from "src/cache/providers/cache-keys.service";

import { ERROR_CODES } from "src/commons/responses/http.responses";
import { RESOLVE_M2M_TARGETS_SCRIPT } from "src/cache/constants/lua-scripts.constants";

import { ExchangeTokenDto } from "./dtos/exchange-token.dto";

import {
  CategorizeExternals,
  CategorizeInternals,
} from "./helper/categorize-targets";

import type { ResourceServerAppSlug } from "./interfaces/exchange-token-rs-appslug-interface";
import type {
  Scopes,
  ExchangeTokenResults,
} from "./interfaces/exchange-token.interface";
import { JWT_TOKEN_PROVIDERS } from "src/security/constants/provider-tokens.constants";

@Injectable()
export class TokenService {
  private readonly APPS: string;
  private readonly APP_SLUG_LOOKUP: string;
  private readonly RESOURCE_SERVER_SLUG_LOOKUP: string;

  private readonly RESERVED_NAME: string;
  private readonly RESERVED_NAME_SLUG: string;
  private readonly RESERVED_NAME_RS_SLUG: string;

  private readonly RESERVED_ENTRY_OBJECT: {
    alias: string;
    rsSlug: string;
    appSlug: string;
  };

  constructor(
    @Inject(JWT_TOKEN_PROVIDERS.M2M_TOKEN_PROVIDER)
    private readonly m2mJwtService: JwtService,

    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
    private readonly cacheKeysService: CacheKeysService
  ) {
    this.APPS = this.cacheKeysService.getGlobalApplicationsKey();

    this.APP_SLUG_LOOKUP =
      this.cacheKeysService.getGlobalApplicationSlugByRsClientIdLookupKey();

    this.RESOURCE_SERVER_SLUG_LOOKUP =
      this.cacheKeysService.getGlobalRsLookupKey();

    this.RESERVED_NAME = this.configService.getOrThrow(
      IAM_CONSTANTS_ENVS.IAM_CORE_SYSTEM_API_RESOURCE_SERVER_NAME
    );

    this.RESERVED_NAME_SLUG = this.configService.getOrThrow(
      IAM_CONSTANTS_ENVS.IAM_CORE_SLUG
    );
    this.RESERVED_NAME_RS_SLUG = this.configService.getOrThrow(
      IAM_CONSTANTS_ENVS.IAM_CORE_SYSTEM_API_RESOURCE_SERVER_NAME_SLUG
    );

    this.RESERVED_ENTRY_OBJECT = {
      alias: this.RESERVED_NAME,
      rsSlug: this.RESERVED_NAME_RS_SLUG,
      appSlug: this.RESERVED_NAME_SLUG,
    };
  }

  async exchange(body: ExchangeTokenDto, origin: ResourceServerAppSlug) {
    const internalsSet = new Set(body.internals || []);
    const externalsSet = new Set(body.externals || []);

    if (internalsSet.size < 1 && externalsSet.size < 1)
      throw new BadRequestException();

    const { internals } = CategorizeInternals(internalsSet);

    const { externals } = CategorizeExternals(
      externalsSet,
      this.RESERVED_ENTRY_OBJECT
    );

    if (Object.keys(internals).length < 1 && Object.keys(externals).length < 1)
      throw new BadRequestException();

    const entry = JSON.stringify({ internals, externals });

    const results = await this.redisService.eval(
      RESOLVE_M2M_TARGETS_SCRIPT,
      3,
      [
        this.RESOURCE_SERVER_SLUG_LOOKUP,
        this.APP_SLUG_LOOKUP,
        this.APPS,
        entry,
        origin.clientId,
      ]
    );
    const data = JSON.parse(results as string) as ExchangeTokenResults;
    this.validateErrors(data);

    const jti = uuidv7();
    const sub = origin.clientId;

    const rawAuds = this.getRawAuds(data);
    const rawScopes = this.getRawScopes(data);

    const payload = new TokenM2MBuilder()
      .setSub(sub)
      .setJti(jti)
      .setAud(rawAuds)
      .setScopes(rawScopes)
      .setRsIssSlug(origin.slug)
      .setAppIssSlug(origin.appSlug)
      .build();

    return this.m2mJwtService.sign(payload);
  }

  private getRawAuds(data: ExchangeTokenResults) {
    const auds: string[] = [];

    data.scopes.forEach(({ aud, target }) => {
      if (target === this.RESERVED_NAME_RS_SLUG)
        return auds.push(this.RESERVED_NAME, aud);

      auds.push(aud, target);
    });

    return auds;
  }

  private getRawScopes(data: ExchangeTokenResults) {
    const scopesArray: string[] = [];

    data.scopes.forEach(({ target, scopes }) => {
      const isFromIAM = target === this.RESERVED_NAME_RS_SLUG;

      scopes.forEach((res) => {
        const { name } = JSON.parse(res as unknown as string) as Scopes;

        const startsWith = name.startsWith("iam:");

        if (isFromIAM && startsWith) return scopesArray.push(name);

        scopesArray.push(`${target}:${name}`);
      });
    });

    return scopesArray.join(" ");
  }

  private validateErrors(data: ExchangeTokenResults) {
    if (data.metadata && Object.keys(data.metadata).length < 1) return;

    throw new ForbiddenException({
      errorCode: ERROR_CODES.RS_INVALID_EXCHANGE_TOKEN_REQUEST,
      exceptions: data.metadata,
    });
  }
}
