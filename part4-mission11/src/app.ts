import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import path from 'path';

import { dirnameFromMeta } from './lib/dirname.js';
import passport from './lib/passport/index.js';
import errorHandler from './middlewares/errorHandler.js';
import { requestLogger } from './middlewares/logger.js';
import routes from './routes/index.js';
import { setupSwagger } from './swagger.js';

export async function buildApp(_opts: { forTest?: boolean } = {}) {
  const app = express();
  const __dirname_safe = dirnameFromMeta(import.meta.url);
  const isProd = process.env.NODE_ENV === 'production';

  // nginx
  app.set('trust proxy', 1);

  app.use(
    cors({
      origin: [process.env.CORS_ORIGIN || 'http://localhost:3001'],
      credentials: true,
    })
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // dev/test 에서만 src/uploads 정적 서빙
  if (!isProd) {
    app.use('/uploads', express.static(path.join(__dirname_safe, './uploads')));
  }

  app.use(cookieParser());
  app.use(passport.initialize());
  app.use(requestLogger);

  app.use('/', routes);
  setupSwagger(app);

  app.use(errorHandler);

  return app;
}
