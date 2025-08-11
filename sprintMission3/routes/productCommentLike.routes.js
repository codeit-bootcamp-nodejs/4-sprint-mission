import express from 'express';
import prisma from '../prisma/prismaClient.js';
import { verifyToken } from '../middlewares/auth.js';
import { getProductCommentLikeCount, createProductCommentLike, deleteProductCommentLike } from '../controller/productCommentLike.controller.js';

const router = express.Router();


// 상품 좋아요 개수 조회
router.get('/:commentId/likes/count', getProductCommentLikeCount);

// 상품 댓글 좋아요 생성
router.post('/:commentId/likes', verifyToken, createProductCommentLike);

// 상품 댓글 좋아요 취소 
router.delete('/:commentId/likes', verifyToken, deleteProductCommentLike);

// 직접 구현된 좋아요 추가 (중복 확인 포함)
router.post('/:commentId/like', verifyToken, async (req, res, next) => {
  const userId = req.user.id;
  const commentId = Number(req.params.commentId);

  try {
    const existingLike = await prisma.productCommentLike.findUnique({
      where: { userId_commentId: { userId, commentId } }
    });
    if (existingLike) {
      return res.status(400).json({ message: '이미 좋아요를 누른 댓글입니다.' });
    }
    const newLike = await prisma.productCommentLike.create({
      data: { userId, commentId }
    });
    res.status(201).json(newLike);
  } catch (error) {
    next (error);
  }
});

// 댓글 좋아요 취소 (인증 필요)
router.delete('/:commentId/like', verifyToken, async (req, res, next) => {
  const userId = req.user.id;
  const commentId = Number(req.params.commentId);

  try {
    await prisma.productCommentLike.delete({
      where: { userId_commentId: { userId, commentId } }
    });
    res.status(200).json({ message: '좋아요 취소 성공' })
  } catch (error) {
    next (error);
  }
});

export default router;