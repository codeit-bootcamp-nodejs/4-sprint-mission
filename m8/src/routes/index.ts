import { Router } from 'express';
import authRoutes from './authRouter.js';
import userRoutes from './userRouter.js';
import productRoutes from './productRouter.js';
import postRoutes from './postRouter.js';
import commentRoutes from './commentRouter.js';
// import likeRoutes from './likeRouter.js';
import imageRoutes from './imageRouter.js';
import notificationRoutes from './notificationRouter.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);
// router.use('/likes', likeRoutes);
router.use('/images', imageRoutes);
router.use('/notifications', notificationRoutes);

export default router;
