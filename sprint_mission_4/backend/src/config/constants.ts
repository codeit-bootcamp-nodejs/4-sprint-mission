export const JWT_SECRET = process.env['JWT_SECRET']!;
export const JWT_REFRESH_SECRET = process.env['JWT_REFRESH_SECRET']!;

export const JWT_CONFIG = {
  ACCESS_TOKEN_EXPIRES_IN: '1h',
  REFRESH_TOKEN_EXPIRES_IN: '7d'
} as const;