import express from 'express';
import prisma from '../prisma/prismaClient.js';
import { validateComment } from '../middlewares/validate.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

// 댓글 목록 조회
router.get('/:articleId', async (req, res, next) => {
  try {
    const articleId = Number(req.params.articleId);
    const { cursor, take = 5 } = req.query;

    if (isNaN(articleId)) {
      return res.status(400).json({ error: '유효한 게시글 ID를 입력해주세요.' })
    }

    const comments = await prisma.articleComment.findMany({
      where: { articleId },
      orderBy: { createdAt: 'desc' },
      take: Number(take),
      ...(cursor && {
        skip: 1,
        cursor: { id: Number(cursor) }
      }),
      select: {
        id: true,
        content: true,
        createdAt: true,
      }
    });

    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
});

// 댓글 등록
router.post('/', verifyToken, validateComment, async (req, res, next) => {
  try {
    const {content, articleId }= req.body;

    if (!articleId) {
      return res.status(400).json({ error: 'articleId는 필수입니다.' });
    }

    const newComment = await prisma.articleComment.create({
      data: {
        content,
        articleId: Number(articleId),
        userId: req.user.id,
      },
    });

    res.status(201).json(newComment);
  } catch (error) {
    next(error);
  }
});

// 댓글 수정
router.patch('/:commentId', verifyToken, validateComment, async (req, res, next) => {
  try {
    const commentId = Number(req.params.commentId);
    const { content } = req.body;

    if (isNaN(commentId)) {
      return res.status(400).json({ error: '유효한 댓글 ID를 입력하세요.' });
    }

    const existingComment = await prisma.articleComment.findUnique({ where: { id } });
      if (!existingComment) {
        return res.status(404).json({ error: '댓글을 찾을 수 없습니다.' });
      }

      const updatedComment = await prisma.articleComment.update({
        where: { id: commentId },
        data: { content },
      });
      
      res.status(200).json(updatedComment);
    } catch (error) {
      next(error);
    }
  });

  // 댓글 삭제
  router.delete('/:commentId', verifyToken, async (req, res, next) => {
    try {
      const commentId = Number(req.params.commentId);

      if (isNaN(commentId)) {
        return res.status(400).json({ error: '유효한 숫자 ID를 입력해주세요.' });
      }

      const existingComment = await prisma.articleComment.findUnique({ where: { id: commentId } });
      if (!existingComment) {
        return res.status(404).json({ error: '댓글을 찾을 수 없습니다.' });
      }

      await prisma.articleComment.delete({ where: { id: commentId } });

      res.status(200).json({ message: `댓글(id: ${commentId}이 성공적으로 삭제되었습니다.` });
    } catch (error) {
      next(error);
    }
  });
  
  export default router;
