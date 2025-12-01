export type SupportedLangs = keyof typeof HTTP_RESPONSES;

export const ERROR_CODES = {
  SECURITY_IP_BLOCKED: "SECURITY_IP_BLOCKED",
  SECURITY_RESOURCE_DISABLED: "SECURITY_RESOURCE_DISABLED",
  SECURITY_RESOURCE_NOT_FOUND: "SECURITY_RESOURCE_NOT_FOUND",

  RS_MISSING_CREDENTIALS: "RS_MISSING_CREDENTIALS",
  RS_INVALID_CREDENTIALS: "RS_INVALID_CREDENTIALS",
  RS_INVALID_EXCHANGE_TOKEN_REQUEST:
    "RESOURCE_SERVER_INVALID_EXCHANGE_TOKEN_REQUEST",

  AUTH_FAILED: "AUTH_FAILED",
  AUTH_UNAUTHORIZED: "AUTH_UNAUTHORIZED",
  AUTH_INVALID_CREDENTIALS: "AUTH_INVALID_CREDENTIALS",
  AUTH_SERVICE_UNAVAILABLE: "AUTH_SERVICE_UNAVAILABLE",

  AUTH_INVALID_ISSUER: "AUTH_INVALID_ISSUER",
  AUTH_INVALID_AUDIENCE: "AUTH_INVALID_AUDIENCE",

  AUTH_MISSING_M2M_TOKEN: "AUTH_M2M_MISSING_TOKEN",
  AUTH_INVALID_M2M_TOKEN: "AUTH_INVALID_M2M_TOKEN",
  AUTH_M2M_TOKEN_EXPIRED: "AUTH_M2M_TOKEN_EXPIRED",
  AUTH_INVALID_M2M_TOKEN_TYPE: "AUTH_INVALID_M2M_TOKEN_TYPE",
  AUTH_INVALID_M2M_TOKEN_TYPE_REQUIRED: "AUTH_INVALID_M2M_TOKEN_TYPE_REQUIRED",

  AUTH_MISSING_USER_TOKEN: "AUTH_USER_MISSING_TOKEN",
  AUTH_INVALID_USER_TOKEN: "AUTH_INVALID_USER_TOKEN",
  AUTH_USER_TOKEN_EXPIRED: "AUTH_USER_TOKEN_EXPIRED",
  AUTH_INVALID_USER_TOKEN_TYPE: "AUTH_INVALID_USER_TOKEN_TYPE",
  AUTH_INVALID_USER_TOKEN_TYPE_REQUIRED:
    "AUTH_INVALID_USER_TOKEN_TYPE_REQUIRED",
} as const;

export const HTTP_RESPONSES = {
  en: {
    [ERROR_CODES.SECURITY_RESOURCE_DISABLED]: {
      message: "This resource is currently disabled by an administrator",
    },
    [ERROR_CODES.SECURITY_IP_BLOCKED]: {
      message: "Too Many Requests. Blocked temporarily",
    },
    [ERROR_CODES.SECURITY_RESOURCE_NOT_FOUND]: {
      message: "Resource definition not found",
    },
    [ERROR_CODES.RS_MISSING_CREDENTIALS]: {
      message: "Client ID and Secret are required",
    },
    [ERROR_CODES.RS_INVALID_CREDENTIALS]: {
      message: "Invalid client credentials",
    },
    [ERROR_CODES.RS_INVALID_EXCHANGE_TOKEN_REQUEST]: {
      message: "Invalid exchange token request",
    },
    [ERROR_CODES.AUTH_FAILED]: {
      message: "Authentication failed",
    },
    [ERROR_CODES.AUTH_UNAUTHORIZED]: {
      message: "Unauthorized",
    },
    [ERROR_CODES.AUTH_INVALID_CREDENTIALS]: {
      message: "Invalid credentials",
    },
    [ERROR_CODES.AUTH_SERVICE_UNAVAILABLE]: {
      message: "Authentication service unavailable",
    },
    [ERROR_CODES.AUTH_INVALID_ISSUER]: {
      message: "Token invalid issuer",
    },
    [ERROR_CODES.AUTH_INVALID_AUDIENCE]: {
      message: "Token invalid audience",
    },
    [ERROR_CODES.AUTH_MISSING_M2M_TOKEN]: {
      message: "M2M Token required",
    },
    [ERROR_CODES.AUTH_INVALID_M2M_TOKEN]: {
      message: "Invalid M2M Token",
    },
    [ERROR_CODES.AUTH_M2M_TOKEN_EXPIRED]: {
      message: "M2M Token expired",
    },
    [ERROR_CODES.AUTH_INVALID_M2M_TOKEN_TYPE]: {
      message: "Invalid M2M Token type",
    },
    [ERROR_CODES.AUTH_INVALID_M2M_TOKEN_TYPE_REQUIRED]: {
      message: "M2M Token type required",
    },
    [ERROR_CODES.AUTH_MISSING_USER_TOKEN]: {
      message: "User Token required",
    },
    [ERROR_CODES.AUTH_INVALID_USER_TOKEN]: {
      message: "Invalid User Token",
    },
    [ERROR_CODES.AUTH_USER_TOKEN_EXPIRED]: {
      message: "User Token expired",
    },
    [ERROR_CODES.AUTH_INVALID_USER_TOKEN_TYPE]: {
      message: "Invalid User Token type",
    },
    [ERROR_CODES.AUTH_INVALID_USER_TOKEN_TYPE_REQUIRED]: {
      message: "User Token type required",
    },
  },
  es: {
    [ERROR_CODES.SECURITY_RESOURCE_DISABLED]: {
      message:
        "Este recurso está actualmente deshabilitado por el administrador",
    },
    [ERROR_CODES.SECURITY_IP_BLOCKED]: {
      message: "Demasiados intentos. Bloqueado temporalmente",
    },
    [ERROR_CODES.SECURITY_RESOURCE_NOT_FOUND]: {
      message: "Definición de recurso no encontrada",
    },
    [ERROR_CODES.RS_MISSING_CREDENTIALS]: {
      message: "El ID de cliente y la clave son requeridos",
    },
    [ERROR_CODES.RS_INVALID_CREDENTIALS]: {
      message: "Credenciales de cliente inválidas",
    },
    [ERROR_CODES.RS_INVALID_EXCHANGE_TOKEN_REQUEST]: {
      message: "Solicitud de intercambio de token de intercambio inválida",
    },
    [ERROR_CODES.AUTH_FAILED]: {
      message: "Autenticación fallida",
    },
    [ERROR_CODES.AUTH_UNAUTHORIZED]: {
      message: "No autorizado",
    },
    [ERROR_CODES.AUTH_INVALID_CREDENTIALS]: {
      message: "Credenciales inválidas",
    },
    [ERROR_CODES.AUTH_SERVICE_UNAVAILABLE]: {
      message: "Servicio de autenticación no disponible",
    },
    [ERROR_CODES.AUTH_INVALID_ISSUER]: {
      message: "Emisor del token inválido",
    },
    [ERROR_CODES.AUTH_INVALID_AUDIENCE]: {
      message: "Audiencia del token inválida",
    },
    [ERROR_CODES.AUTH_MISSING_M2M_TOKEN]: {
      message: "Token M2M requerido",
    },
    [ERROR_CODES.AUTH_M2M_TOKEN_EXPIRED]: {
      message: "Token M2M expirado",
    },
    [ERROR_CODES.AUTH_INVALID_M2M_TOKEN]: {
      message: "Token M2M inválido",
    },
    [ERROR_CODES.AUTH_INVALID_M2M_TOKEN_TYPE]: {
      message: "Token de tipo M2M inválido",
    },
    [ERROR_CODES.AUTH_INVALID_M2M_TOKEN_TYPE_REQUIRED]: {
      message: "Token de tipo M2M requerido",
    },
    [ERROR_CODES.AUTH_MISSING_USER_TOKEN]: {
      message: "Token de usuario requerido",
    },
    [ERROR_CODES.AUTH_INVALID_USER_TOKEN]: {
      message: "Token de usuario inválido",
    },
    [ERROR_CODES.AUTH_USER_TOKEN_EXPIRED]: {
      message: "Token de usuario expirado",
    },
    [ERROR_CODES.AUTH_INVALID_USER_TOKEN_TYPE]: {
      message: "Token de usuario de tipo inválido",
    },
    [ERROR_CODES.AUTH_INVALID_USER_TOKEN_TYPE_REQUIRED]: {
      message: "Token de usuario de tipo requerido",
    },
  },
} as const;
