import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { prismaErrorHandler } from '@/middlewares/errorHandlers/prismaErrorHandler.js';
import { zodErrorHandler } from '@/middlewares/errorHandlers/zodErrorHandler.js';
import { catchAllErrorHandler } from '@/middlewares/errorHandlers/catchAllErrorHandler.js';
import { businessErrorHandler } from '@/middlewares/errorHandlers/businessErrorHandler.js';
import swaggerUi from 'swagger-ui-express';
import articleRouter from '@/routers/articles.routes.js';
import productRouter from '@/routers/products.routes.js';
import fileRouter from '@/routers/images.routes.js';
import authRouter from '@/routers/auths.routes.js';
import userRouter from '@/routers/users.routes.js';
import { specs } from '@/documentation/options.js';
import notificationRouter from '@/routers/notifications.routes.js';
import { NODE_ENV } from '@/lib/constants.js';

const app = express();

app.use(
  cors({
    allowedHeaders: ['Content-Type', 'Authorization', 'x-refresh-token'],
  }),
);
if (NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}
app.get('/health', (req, res) => {
  return res.status(200).send('Server is running!');
});

app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: true }));

app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/article', articleRouter);
app.use('/product', productRouter);
app.use('/uploads', fileRouter);
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/notification', notificationRouter);

app.use(prismaErrorHandler);
app.use(zodErrorHandler);
app.use(businessErrorHandler);
app.use(catchAllErrorHandler);

export { app };
