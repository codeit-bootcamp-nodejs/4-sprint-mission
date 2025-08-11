import express from 'express';
import prisma from '../prisma/prismaClient.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

// 댓글 좋아요 생성
router.post('/:commentId/like', verifyToken, async (req, res, next) => {
  try {
    const commentId = Number(req.params.commentId);
    const userId = req.user.id;

    if (isNaN(commentId)) {
      return res.status(400).json({ error: '유효한 댓글 ID를 입력해주세요.' });
    }

    // 중복 좋아요 방지 위해 먼저 확인
    const existingLike = await prisma.commentLike.findUnique({
      where: { userId_commentId: { userId, commentId } },
    });

    if (existingLike) {
      return res.status(400).json({ error: '이미 좋아요를 누를 댓글입니다.' });
    }

    // 좋아요 생성
    const newLike = await prisma.commentLike.create({
      data: { userId, commentId},
    });

    res.status(201).json(newLike)
  } catch (error) {
    next (error);
  }
});

// 댓글 좋아요 삭제
router.delete('/:commentId/like', verifyToken, async (req, res, next) => {
  try {
    const commentId = Number(req.params.commentId);
    const userId = req.user.id;

    if (isNaN(commentId)) {
      return res.status(400).json({ error: '유효한 댓글 ID를 입력해주세요.' });
    }

    const existingLike = await prisma.commentLike.findUnique({
      where: { userId_commentId: { userId, commentId } },
    });

    if (!existingLike) {
      return res.status(404).json({ error: '좋아요가 존재하지 않습니다.' });
    }

    await prisma.commentLike.delete({
      where: { userId_commentId: { userId, commentId } },
    });
    
    res.status(200).json({ message: '좋아요가 취소되었습니다.' });
  } catch (error) {
    next (error);
  }
});


// 댓글 좋아요 개수 조회
router.get('/:commentId/likes', async (req, res, next) => {
  try {
    const commentId = Number(req.params.commentId);

    if (isNaN(commentId)) {
      return res.status(400).json({ error: '유효한 댓글 ID를 입력해주세요.' })
    }

    const likeCount = await prisma.commentLike.count({
      where: { commentId },
    });

    res.status(200).json({ likeCount });
  } catch (error) {
    next (error);
  }
});

export default router;