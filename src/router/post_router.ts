//src/routes/post_router.ts
import { Router } from 'express';
import postController from '../controllers/post_controller';
import commentController from '../controllers/comment_controller';
import { authenticate } from '../middlewares/auth_middleware';

const router = Router();

router.get('/', postController.getPosts);
router.get('/:id', postController.getPostById);
router.post('/', authenticate, postController.createPost);
router.patch('/:id', authenticate, postController.updatePost);
router.delete('/:id', authenticate, postController.deletePost);
router.post('/:postId/comments', authenticate, commentController.createComment);

export default router;