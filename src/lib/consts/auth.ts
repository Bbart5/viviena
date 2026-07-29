export const SESSION_TOKEN_COOKIE_NAME = 'sessionToken' as const;
export const SESSION_TOKEN_COOKIE_PATH = '/' as const;

// Shared by the JWT expiry and the cookie max-age so they cannot drift apart.
export const SESSION_TTL_SECONDS = 24 * 60 * 60;
