import express from 'express';
import userRouter from './userRouter.js';
import articleRouter from './articleRouter.js';
import productRouter from './productRouter.js';
import commentRouter from './commentRouter.js';
import likeRouter from './likeRouter.js';

const router = express.Router();

router.use(userRouter);
router.use(articleRouter);
router.use(productRouter);
router.use(commentRouter);
router.use(likeRouter)

export default router;