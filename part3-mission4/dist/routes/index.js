import express from 'express';
import productRouter from './product-router.js';
import articleRouter from './article-router.js';
import userRouter from './user-router.js';
import imageRouter from '../image.js';
import authRouter from './auth-router.js';
import productCommentRouter from './product-cmt-router.js';
import articleCommentRouter from './article-cmt-router.js';
const router = express.Router();
router.use('/users', userRouter);
router.use('/products', productRouter);
router.use('/products', productCommentRouter);
router.use('/articles', articleRouter);
router.use('/articles', articleCommentRouter);
router.use('/images', imageRouter);
router.use('/auth', authRouter);
export default router;
//# sourceMappingURL=index.js.map