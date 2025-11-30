import type { JwtM2MPayload } from "src/security/interfaces/jwt.payload";

export class TokenM2MBuilder {
  private payload: Partial<JwtM2MPayload> = {
    type: "m2m",
  };

  setSub(sub: string) {
    this.payload.sub = sub;

    return this;
  }

  setJti(jti: string) {
    this.payload.jti = jti;

    return this;
  }

  setAud(aud: string[]) {
    this.payload.aud = aud;

    return this;
  }

  setScopes(scopes: string) {
    this.payload.scopes = scopes;

    return this;
  }

  setRsIssSlug(iss: string) {
    this.payload.issRsSlug = iss;

    return this;
  }

  setAppIssSlug(iss: string) {
    this.payload.issAppSlug = iss;

    return this;
  }

  build() {
    return this.payload;
  }
}
