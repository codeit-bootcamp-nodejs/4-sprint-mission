import { Router } from 'express';
import userRoutes from './user.routes';
import postRoutes from './post.routes';

const router = Router();

// API 라우트 등록
router.use('/users', userRoutes);
router.use('/posts', postRoutes);

export default router;