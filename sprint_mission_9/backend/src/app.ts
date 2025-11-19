import express, { Application } from 'express';
import cors from 'cors';
import productsRouter from './features/products/products.routes';
import articlesRouter from './features/articles/articles.routes';
import commentsRouter from './features/comments/comments.routes';
import usersRouter from './features/users/users.routes';
import uploadRouter from './features/upload/upload.routes';
import { errorHandler } from './shared/middlewares/error.middleware';
import prisma from './shared/database/prisma.client';
import { env } from './shared/config/env';

const app: Application = express();

// Middleware
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/products', productsRouter);
app.use('/api/articles', articlesRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/users', usersRouter);
app.use('/api/upload', uploadRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handler
app.use(errorHandler);

export { app, prisma };
