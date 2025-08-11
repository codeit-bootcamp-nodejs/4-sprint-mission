import express from 'express';
import prisma from '../prisma/prismaClient.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

// 댓글 좋아요 개수 조회
router.get('/:commentId/likes', async (req, res, next) => {
  try {
    const commentId = Number(req.params.commentId);
    if (isNaN(commentId)) {
      return res.status(400).json({ error: '유효한 댓글 ID를 입력해주세요.' });
    }

    const likeCount = await prisma.articleCommentLike.count({
      where: { commentId },
    });

    res.status(200).json({ likeCount });
  } catch (error) {
    next(error);
  }
});

// 댓글 좋아요 추가
router.post('/:commentId/like', verifyToken, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const commentId = Number(req.params.commentId);

    const existingLike = await prisma.articleCommentLike.findUnique({
      where: { userId_commentId: { userId, commentId } },
    });

    if (existingLike) {
      return res.status(400).json({ message: '이미 좋아요를 누른 댓글입니다.' });
    }

    const newLike = await prisma.articleCommentLike.create({
      data: { userId, commentId },
    });

    res.status(201).json(newLike);
  } catch (error) {
    next(error);
  }
});

// 댓글 좋아요 취소
router.delete('/:commentId/like', verifyToken, async (req, res, next)=> {
  try {
    const userId = req.user.id;
    const commentId = Number(req.params.commentId);

    await prisma.articleCommentLike.delete({
      where: { userId_commentId: { userId, commentId } },
    });

    res.status(200).json({ message: '좋아요가 취소되었습니다.' });
  } catch (error) {
    next(error);
  }
});

export default router;