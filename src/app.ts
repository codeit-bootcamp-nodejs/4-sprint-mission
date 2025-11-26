//src/app.ts
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import authRouter from './router/auth_router';
import notificationRouter from './router/notification_router';
import productRouter from './router/product_router';
import postRouter from './router/post_router';

const app: Express = express();

app.use(cors({
    origin: '*',
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.get('/', (req: Request, res: Response) => {
    res.status(200).send('Server is running!');
});

app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

app.use('/api/auth', authRouter);
app.use('/api/products', productRouter);
app.use('/api/posts', postRouter);
app.use('/api/notifications', notificationRouter);

export default app;