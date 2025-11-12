import express from 'express';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { PORT, PUBLIC_PATH, STATIC_PATH } from './lib/constants';
import articlesRouter from './routers/articlesRouter';
import productsRouter from './routers/productsRouter';
import commentsRouter from './routers/commentsRouter';
import imagesRouter from './routers/imagesRouter';
import authRouter from './routers/authRouter';
import usersRouter from './routers/usersRouter';
import notificationsRouter from './routers/notificationsRouter';
import { defaultNotFoundHandler, globalErrorHandler } from './controllers/errorController';
import { initSocketIO } from './lib/socket';

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

// HTTP 서버 생성
const httpServer = createServer(app);

// Socket.IO 초기화
initSocketIO(httpServer);

// 서버 시작
httpServer.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  console.log(`Socket.IO is ready`);
});
