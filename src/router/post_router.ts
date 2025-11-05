//src/routes/post_router.ts
import { Router } from 'express';
import commentController from '../controllers/comment_controller';

const router = Router();

router.post('/:postId/comments', commentController.createComment);

export default router;