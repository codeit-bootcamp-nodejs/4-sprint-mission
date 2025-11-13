import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { createServer } from 'http';

import { appConfig } from './config/app.config.js';
import { authRouter } from './domain/auth/auth.router.js';
import { CommentCreatedEvent } from './domain/comment/comment.js';
import { CommentNotificationHandler } from './domain/handler/comment-notification.handler.js';
import { PriceUpdateNotificationHandler } from './domain/handler/product-price-update-notification.handler.js';
import { notificationRouter } from './domain/notification/notification.router.js';
import { postRouter } from './domain/post/post.router.js';
import { PriceUpdateEvent } from './domain/product/product.js';
import { productRouter } from './domain/product/product.router.js';
import { errorMiddleware } from './middleware/error.middleware.js';
import { loggerMiddleware } from './middleware/logger.middleware.js';
import { eventBus } from './utils/event-bus.js';
import logger from './utils/logger.js';
import { limiter } from './utils/rate-limit.js';
import { setupSocket } from './utils/socket.js';

const app = express();
const httpServer = createServer(app);
const io = setupSocket(httpServer);

eventBus.subscribe(PriceUpdateEvent, new PriceUpdateNotificationHandler(io));
eventBus.subscribe(CommentCreatedEvent, new CommentNotificationHandler(io));

app.use(express.json());
app.use(loggerMiddleware);
app.use(cors({ origin: appConfig.cors_origin, credentials: appConfig.cors_credentials }));
app.use(compression({ threshold: appConfig.compression_threshold, level: appConfig.compression_level }));
app.use(limiter);
app.use(helmet());

app.use('/auth', authRouter);
app.use('/posts', postRouter);
app.use('/products', productRouter);
app.use('/notifications', notificationRouter);

app.use(errorMiddleware);

httpServer.listen(appConfig.port, () => {
  logger.info(`서버 이름: ${appConfig.app_name}`);
  logger.info(`서버 실행 포트: ${appConfig.port}`);
  logger.info(`환경: ${appConfig.node_env}`);
  logger.info(`CORS 허용: ${appConfig.cors_origin}`);
});
