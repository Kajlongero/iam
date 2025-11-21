export const HTTP_RESPONSES = {
  403: {
    RESOURCE_DISABLED_FORBIDDEN: {
      statusCode: 403,
      message: "This resource is currently disabled by administrator",
      errorCode: "RESOURCE_DISABLED",
    },
  },
  429: {
    BRUTE_FORCE_TOO_MANY_REQUESTS: {
      statusCode: 429,
      message: "Too Many Requests. Blocked temporarily",
      errorCode: "SECURITY_IP_BLOCKED",
    },
  },
};
