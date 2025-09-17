//src/routes/posts.js

const express = require('express');
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// 게시글 목록 조회 (인증 불필요)
router.get('/', postController.getPosts);

// 게시글 상세 조회 (인증 불필요하지만, 좋아요 상태 확인을 위해 선택적 인증)
router.get('/:id', (req, res, next) => {
  // 인증 헤더가 있으면 인증 처리, 없으면 바로 다음으로 넘어감
  if (req.headers.authorization) {
    authMiddleware(req, res, next);
  } else {
    next();
  }
}, postController.getPostById);

// 인증이 필요한 엔드포인트
router.use(authMiddleware);

// 게시글 생성
router.post('/', postController.createPost);

// 게시글 수정
router.put('/:id', postController.updatePost);

// 게시글 삭제
router.delete('/:id', postController.deletePost);

// 게시글 좋아요
router.post('/:id/like', postController.likePost);

// 게시글 좋아요 취소
router.delete('/:id/like', postController.unlikePost);

module.exports = router;