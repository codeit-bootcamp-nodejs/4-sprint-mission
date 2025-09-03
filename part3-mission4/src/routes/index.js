import express from 'express';
import productRouter from './product-router.js';
import articleRouter from './article-router.js';
import userRouter from './user-router.js';
import imageRouter from '../image.js';

const router = express.Router();

router.use('/users', userRouter);
router.use('/products', productRouter);
router.use('/articles', articleRouter);
router.use('/images', imageRouter);

export default router;
