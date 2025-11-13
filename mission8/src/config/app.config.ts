export const appConfig = {
  node_env: process.env['NODE_ENV'] || 'development',
  port: process.env['PORT'] || 3000,
  cors_origin: process.env['CORS_ORIGIN'] || 'http://localhost:3000',
  cors_credentials: process.env['CORS_CREDENTIALS'] === 'true',
  rateLimitWindowMs: Number(process.env['RATE_LIMIT_WINDOW_MS']) || 15 * 60 * 1000,
  rateLimitMax: Number(process.env['RATE_LIMIT_MAX']) || 100,
  compression_threshold: Number(process.env['COMPRESSION_THRESHOLD']) || 1024,
  compression_level: Number(process.env['COMPRESSION_LEVEL']) || 6,
  bcryptSaltRounds: Number(process.env['BCRYPT_SALT_ROUNDS']) || 10,
  app_name: process.env['APP_NAME'] || 'app_name',
  logLevel: process.env['LOG_LEVEL'] || 'info',
};
