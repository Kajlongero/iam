interface BasePayload {
  sub: string;
  aud?: string[];
  exp?: string;
  iss?: string;
  iat?: string;
}

export interface JwtUserPayload extends BasePayload {
  jti: string;
  roles: string[];
}

export interface JwtRefreshPayload extends BasePayload {
  jti: string;
}

export interface JwtM2MPayload extends BasePayload {
  jti: string;
  aud: string[];
  type: "m2m";
  scopes: string;
  issRsSlug?: string;
  issAppSlug?: string;
}
