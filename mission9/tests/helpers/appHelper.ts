import express, { Express } from 'express';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import { PUBLIC_PATH, STATIC_PATH } from '../../src/lib/constants';
import articlesRouter from '../../src/routers/articlesRouter';
import productsRouter from '../../src/routers/productsRouter';
import commentsRouter from '../../src/routers/commentsRouter';
import imagesRouter from '../../src/routers/imagesRouter';
import authRouter from '../../src/routers/authRouter';
import usersRouter from '../../src/routers/usersRouter';
import notificationsRouter from '../../src/routers/notificationsRouter';
import {
  defaultNotFoundHandler,
  globalErrorHandler,
} from '../../src/controllers/errorController';

/**
 * Create Express app for testing (without Socket.IO)
 */
export function createTestApp(): Express {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());
  app.use(STATIC_PATH, express.static(path.resolve(process.cwd(), PUBLIC_PATH)));

  app.use('/articles', articlesRouter);
  app.use('/products', productsRouter);
  app.use('/comments', commentsRouter);
  app.use('/images', imagesRouter);
  app.use('/auth', authRouter);
  app.use('/users', usersRouter);
  app.use('/notifications', notificationsRouter);

  app.use(defaultNotFoundHandler);
  app.use(globalErrorHandler);

  return app;
}
