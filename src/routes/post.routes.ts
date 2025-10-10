import { Router } from 'express';
import { PostController } from '@/controllers/post.controller';

const router = Router();
const postController = new PostController();

// 포스트 관련 라우트
router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);
router.get('/user/:userId', postController.getPostsByUserId);
router.post('/', postController.createPost);
router.put('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);

export default router;