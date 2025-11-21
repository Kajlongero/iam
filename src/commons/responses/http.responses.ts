export type SupportedLangs = keyof typeof HTTP_RESPONSES;

export const ERROR_CODES = {
  RESOURCE_DISABLED: "RESOURCE_DISABLED",
  SECURITY_IP_BLOCKED: "SECURITY_IP_BLOCKED",
} as const;

export const HTTP_RESPONSES = {
  en: {
    [ERROR_CODES.RESOURCE_DISABLED]: {
      message: "This resource is currently disabled by an administrator",
    },
    [ERROR_CODES.SECURITY_IP_BLOCKED]: {
      message: "Too Many Requests. Blocked temporarily",
    },
  },
  es: {
    [ERROR_CODES.RESOURCE_DISABLED]: {
      message:
        "Este recurso está actualmente deshabilitado por el administrador",
    },
    [ERROR_CODES.SECURITY_IP_BLOCKED]: {
      message: "Demasiados intentos. Bloqueado temporalmente",
    },
  },
} as const;
