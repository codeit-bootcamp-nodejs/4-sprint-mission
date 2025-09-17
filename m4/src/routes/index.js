import { Router } from 'express';
import authRoutes from './authRouter.js';
import userRoutes from './userRouter.js';
import productRoutes from './productRouter.js';
import postRoutes from './postRouter.js';
import commentRoutes from './commentRouter.js';
// import likeRoutes from './likeRouter.js'; (확장용)
import imageRoutes from './imageRouter.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);
// router.use('/likes', likeRoutes); (확장용)
router.use('/images', imageRoutes);

export default router;
