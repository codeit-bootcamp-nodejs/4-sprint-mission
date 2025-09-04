import express from 'express';
import { prisma } from '../utils/prisma.util.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

// 댓글 생성 (게시글)
router.post('/articles/:articleId/comments', authMiddleware, async (req, res, next) => {
  try {
    const { articleId } = req.params;
    const { content } = req.body;
    const { id: userId } = req.user;

    const article = await prisma.article.findUnique({ where: { id: +articleId } });
    if (!article) {
      return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    }

    if (!content) {
      return res.status(400).json({ message: '댓글 내용을 입력해주세요.' });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        authorId: userId,
        articleId: +articleId,
      },
    });

    return res.status(201).json({ data: comment });
  } catch (err) {
    next(err);
  }
});

// 댓글 생성 (상품) 
router.post('/products/:productId/comments', authMiddleware, async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { content } = req.body;
    const { id: userId } = req.user;

    const product = await prisma.product.findUnique({ where: { id: +productId } });
    if (!product) {
      return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
    }

    if (!content) {
      return res.status(400).json({ message: '댓글 내용을 입력해주세요.' });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        authorId: userId,
        productId: +productId,
      },
    });

    return res.status(201).json({ data: comment });
  } catch (err) {
    next(err);
  }
});

// 댓글 조회 (게시글)
router.get('/articles/:articleId/comments', async (req, res, next) => {
  try {
    const { articleId } = req.params;

    const article = await prisma.article.findUnique({ where: { id: +articleId } });
    if (!article) {
      return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    }

    const comments = await prisma.comment.findMany({
      where: { articleId: +articleId },
      orderBy: { createdAt: 'desc' },
      select: { id: true, content: true, createdAt: true, updatedAt: true, author: { select: { nickname: true } } },
    });

    return res.status(200).json({ data: comments });
  } catch (err) {
    next(err);
  }
});

// 댓글 조회 (상품)
router.get('/products/:productId/comments', async (req, res, next) => {
  try {
    const { productId } = req.params;

    const product = await prisma.product.findUnique({ where: { id: +productId } });
    if (!product) {
      return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
    }

    const comments = await prisma.comment.findMany({
      where: { productId: +productId },
      orderBy: { createdAt: 'desc' },
      select: { id: true, content: true, createdAt: true, updatedAt: true, author: { select: { nickname: true } } },
    });

    return res.status(200).json({ data: comments });
  } catch (err) {
    next(err);
  }
});

// 댓글 수정
router.put('/comments/:commentId', authMiddleware, async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const { id: userId } = req.user;

    if (!content) {
      return res.status(400).json({ message: '수정할 내용을 입력해주세요.' });
    }

    const comment = await prisma.comment.findUnique({ where: { id: +commentId } });
    if (!comment) {
      return res.status(404).json({ message: '댓글을 찾을 수 없습니다.' });
    }
    if (comment.authorId !== userId) {
      return res.status(403).json({ message: '댓글을 수정할 권한이 없습니다.' });
    }

    const updatedComment = await prisma.comment.update({
      where: { id: +commentId },
      data: { content },
    });

    return res.status(200).json({ data: updatedComment });
  } catch (err) {
    next(err);
  }
});

// 댓글 삭제
router.delete('/comments/:commentId', authMiddleware, async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { id: userId } = req.user;

    const comment = await prisma.comment.findUnique({ where: { id: +commentId } });
    if (!comment) {
      return res.status(404).json({ message: '댓글을 찾을 수 없습니다.' });
    }
    if (comment.authorId !== userId) {
      return res.status(403).json({ message: '댓글을 삭제할 권한이 없습니다.' });
    }

    await prisma.comment.delete({ where: { id: +commentId } });

    return res.status(200).json({ message: '댓글이 성공적으로 삭제되었습니다.' });
  } catch (err) {
    next(err);
  }
});

export default router;
