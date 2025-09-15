import express from 'express';
import userRouter from './userRouter';
import articleRouter from './articleRouter';
import productRouter from './productRouter';
import commentRouter from './commentRouter';
import likeRouter from './likeRouter';
import photoRouter from './photoRouter';

const router = express.Router();

router.use(userRouter);
router.use(articleRouter);
router.use(productRouter);
router.use(commentRouter);
router.use(likeRouter);
router.use(photoRouter);

export default router;