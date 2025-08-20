import express from 'express';
import { prisma } from '../lib/prisma.js';
import { validateArticle } from '../middlewares/validators.js';

const router = express.Router();

// 게시글 등록
router.post('/', validateArticle, async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const created = await prisma.article.create({ data: { title, content } });
    res.status(201).json(created);
  } catch (e) {
    next(e);
  }
});

// 게시글 목록 (offset 페이지네이션, 최근순, 검색)
router.get('/', async (req, res, next) => {
  try {
    const { page = '1', limit = '10', sort = 'recent', q } = req.query;
    const take = Math.max(1, Math.min(100, Number(limit)));
    const p = Math.max(1, Number(page));
    const skip = (p - 1) * take;

    const where = q
      ? {
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { content: { contains: q, mode: 'insensitive' } }
          ]
        }
      : {};

    const orderBy =
      sort === 'recent' ? { createdAt: 'desc' } : { id: 'asc' };

    const [total, items] = await Promise.all([
      prisma.article.count({ where }),
      prisma.article.findMany({
        where,
        select: { id: true, title: true, content: true, createdAt: true },
        orderBy,
        skip,
        take
      })
    ]);

    res.status(200).json({ page: p, limit: take, total, items });
  } catch (e) {
    next(e);
  }
});

// /articles/:id GET, PATCH, DELETE
router
  .route('/:id')
  .get(async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const found = await prisma.article.findUnique({
        where: { id },
        select: { id: true, title: true, content: true, createdAt: true }
      });
      if (!found) return res.status(404).json({ message: '게시글 없음' });
      res.status(200).json(found);
    } catch (e) {
      next(e);
    }
  })
  .patch(async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const { title, content } = req.body;
      const data = {};
      if (typeof title === 'string') data.title = title;
      if (typeof content === 'string') data.content = content;

      const updated = await prisma.article.update({ where: { id }, data });
      res.status(200).json(updated);
    } catch (e) {
      if (e.code === 'P2025') return res.status(404).json({ message: '게시글 없음' });
      next(e);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      await prisma.article.delete({ where: { id } });
      res.status(204).send();
    } catch (e) {
      if (e.code === 'P2025') return res.status(404).json({ message: '게시글 없음' });
      next(e);
    }
  });

export default router;
