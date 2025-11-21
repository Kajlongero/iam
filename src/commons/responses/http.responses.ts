export const HTTP_RESPONSES = {
  429: {
    BRUTE_FORCE_TOO_MANY_REQUESTS: {
      statusCode: 429,
      message: "Too Many Requests. Blocked temporarily",
      errorCode: "SECURITY_IP_BLOCKED",
    },
  },
};
