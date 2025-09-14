import express from 'express';
import { 
  updateComment,
  deleteComment,
  commentValidation
} from '../controllers/commentController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// 댓글 수정 (작성자만)
router.put('/:id', authenticateToken, commentValidation, updateComment);

// 댓글 삭제 (작성자만)
router.delete('/:id', authenticateToken, deleteComment);

export default router;