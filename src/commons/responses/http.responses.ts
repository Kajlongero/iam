export type SupportedLangs = keyof typeof HTTP_RESPONSES;

export const ERROR_CODES = {
  SECURITY_IP_BLOCKED: "SECURITY_IP_BLOCKED",
  SECURITY_RESOURCE_DISABLED: "SECURITY_RESOURCE_DISABLED",
  SECURITY_RESOURCE_NOT_FOUND: "SECURITY_RESOURCE_NOT_FOUND",

  RS_MISSING_CREDENTIALS: "RS_MISSING_CREDENTIALS",
  RS_INVALID_CREDENTIALS: "RS_INVALID_CREDENTIALS",

  AUTH_FAILED: "AUTH_FAILED",
  AUTH_UNAUTHORIZED: "AUTH_UNAUTHORIZED",
  AUTH_INVALID_CREDENTIALS: "AUTH_INVALID_CREDENTIALS",
  AUTH_SERVICE_UNAVAILABLE: "AUTH_SERVICE_UNAVAILABLE",
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
  },
} as const;
