import type { StringValue } from 'ms';

export const authConfig = {
  accessTokenSecretKey: process.env['ACCESS_TOKEN_SECRET_KEY'] ?? 'default-access-token-secret',
  refreshTokenSecretKey: process.env['REFRESH_TOKEN_SECRET_KEY'] ?? 'default-refresh-token-secret',
  accessTokenExpiresIn: (process.env['ACCESS_TOKEN_EXPIRES_IN'] as StringValue) ?? '1h',
  refreshTokenExpiresIn: (process.env['REFRESH_TOKEN_EXPIRES_IN'] as StringValue) ?? '7d',
};
