export interface Scopes {
  name: string;
}

export interface ExchangeTokenStatus {
  statusCode: number;
  message: string;
  error: string;
}

export interface ExchangeTokenScopes {
  aud: string;
  app: string;
  target: string;
  success: boolean;
  isExternal: boolean;
  scopes: Scopes[];
}

export interface ExchangeTokenResults {
  scopes: ExchangeTokenScopes[];
  success: boolean;
  metadata?: object | ExchangeTokenStatus;
}
