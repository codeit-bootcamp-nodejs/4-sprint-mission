const express = require('express');
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// 댓글 목록 조회 (인증 불필요)
router.get('/', commentController.getComments);

// 인증이 필요한 엔드포인트
router.use(authMiddleware);

// 댓글 생성
router.post('/', commentController.createComment);

// 댓글 수정
router.put('/:id', commentController.updateComment);

// 댓글 삭제
router.delete('/:id', commentController.deleteComment);

module.exports = router;