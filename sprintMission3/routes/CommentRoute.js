import express from 'express';
import {
  updateComment,
  deleteComment,
} from '../controllers/CommentController.js';

const router = express.Router();

// 특정 댓글 수정 및 삭제 (부모와 무관하게 댓글 ID로 직접 접근)
router.route('/:commentId').patch(updateComment).delete(deleteComment);

export default router;
