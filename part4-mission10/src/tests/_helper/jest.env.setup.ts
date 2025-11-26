process.env.NODE_ENV ??= 'test';

process.env.ACCESS_TOKEN_SECRET ??= 'test_access';
process.env.REFRESH_TOKEN_SECRET ??= 'test_refresh';
process.env.ACCESS_TOKEN_COOKIE_NAME ??= 'access-token';
process.env.REFRESH_TOKEN_COOKIE_NAME ??= 'refresh-token';
process.env.ACCESS_TOKEN_EXPIRES_IN ??= '15m';
process.env.REFRESH_TOKEN_EXPIRES_IN ??= '7d';

process.env.RESEND_API_KEY ??= 'dummy';
process.env.DATABASE_URL ??= 'postgresql://user:pass@localhost:5432/dbname';
