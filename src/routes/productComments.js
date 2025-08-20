import express from 'express';
import { prisma } from '../lib/prisma.js';
import { validateComment } from '../middlewares/validators.js';

const router = express.Router({ mergeParams: true });

// 댓글 등록 (중고마켓)
router.post('/', validateComment, async (req, res, next) => {
  try {
    const productId = Number(req.params.productId);
    const { content } = req.body;

    // 제품 존재 확인
    const exist = await prisma.product.findUnique({ where: { id: productId } });
    if (!exist) return res.status(404).json({ message: '상품 없음' });

    const created = await prisma.productComment.create({
      data: { content, productId }
    });
    res.status(201).json(created);
  } catch (e) {
    next(e);
  }
});

// 댓글 목록 (cursor 페이지네이션)
router.get('/', async (req, res, next) => {
  try {
    const productId = Number(req.params.productId);
    const { cursor, limit = '10' } = req.query;

    const take = Math.max(1, Math.min(50, Number(limit)));

    const exist = await prisma.product.findUnique({ where: { id: productId } });
    if (!exist) return res.status(404).json({ message: '상품 없음' });

    const where = { productId };
    const orderBy = { id: 'desc' };

    const items = await prisma.productComment.findMany({
      where,
      orderBy,
      take: take + 1,
      ...(cursor ? { cursor: { id: Number(cursor) }, skip: 1 } : {})
    });

    let nextCursor = null;
    if (items.length > take) {
      const next = items.pop();
      nextCursor = next.id;
    }

    res.status(200).json({ items, nextCursor });
  } catch (e) {
    next(e);
  }
});

// 댓글 수정
router.patch('/:commentId', validateComment, async (req, res, next) => {
  try {
    const commentId = Number(req.params.commentId);
    const { content } = req.body;

    const updated = await prisma.productComment.update({
      where: { id: commentId },
      data: { content }
    });
    res.status(200).json(updated);
  } catch (e) {
    if (e.code === 'P2025') return res.status(404).json({ message: '댓글 없음' });
    next(e);
  }
});

// 댓글 삭제
router.delete('/:commentId', async (req, res, next) => {
  try {
    const commentId = Number(req.params.commentId);
    await prisma.productComment.delete({ where: { id: commentId } });
    res.status(204).send();
  } catch (e) {
    if (e.code === 'P2025') return res.status(404).json({ message: '댓글 없음' });
    next(e);
  }
});

export default router;
