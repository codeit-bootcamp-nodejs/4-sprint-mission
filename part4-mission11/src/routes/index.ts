import express from 'express';

import articleRouter from './article-router.js';
import authRouter from './auth-router.js';
import articleCommentRouter from './comments/article-comment-router.js';
import productCommentRouter from './comments/product-comment-router.js';
import imageRouter from './image-router.js';
import notificationRouter from './notification-router.js';
import productRouter from './product-router.js';
import userRouter from './user-router.js';

const router = express.Router();

router.use('/users', userRouter);
router.use('/products', productRouter);
router.use('/products', productCommentRouter);
router.use('/articles', articleRouter);
router.use('/articles', articleCommentRouter);
router.use('/images', imageRouter);
router.use('/auth', authRouter);
router.use('/notifications', notificationRouter);

export default router;
