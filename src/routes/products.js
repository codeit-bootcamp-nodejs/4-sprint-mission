import express from 'express';
import { prisma } from '../lib/prisma.js';
import { validateProduct } from '../middlewares/validators.js';

const router = express.Router();

// 상품 등록
router.post('/', validateProduct, async (req, res, next) => {
  try {
    const { name, description, price, tags = [], imageUrl = null } = req.body;
    const created = await prisma.product.create({
      data: { name, description, price: Number(price), tags, imageUrl }
    });
    res.status(201).json(created);
  } catch (e) {
    next(e);
  }
});

// 상품 목록 (offset 페이지네이션, 최근순 정렬, 검색)
router.get('/', async (req, res, next) => {
  try {
    const {
      page = '1',
      limit = '10',
      sort = 'recent',
      q // name/description 검색어
    } = req.query;

    const take = Math.max(1, Math.min(100, Number(limit)));
    const p = Math.max(1, Number(page));
    const skip = (p - 1) * take;

    const where = q
      ? {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } }
          ]
        }
      : {};

    const orderBy =
      sort === 'recent' ? { createdAt: 'desc' } : { id: 'asc' };

    const [total, items] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        select: { id: true, name: true, price: true, createdAt: true },
        orderBy,
        skip,
        take
      })
    ]);

    res.status(200).json({
      page: p,
      limit: take,
      total,
      items
    });
  } catch (e) {
    next(e);
  }
});

// /products/:id GET, PATCH, DELETE - app.route 스타일
router
  .route('/:id')
  // 상품 상세
  .get(async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const found = await prisma.product.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          tags: true,
          createdAt: true
        }
      });
      if (!found) return res.status(404).json({ message: '상품 없음' });
      res.status(200).json(found);
    } catch (e) {
      next(e);
    }
  })
  // 상품 수정 (PATCH)
  .patch(async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const { name, description, price, tags, imageUrl } = req.body;

      const data = {};
      if (typeof name === 'string') data.name = name;
      if (typeof description === 'string') data.description = description;
      if (price !== undefined) data.price = Number(price);
      if (Array.isArray(tags)) data.tags = tags;
      if (typeof imageUrl === 'string' || imageUrl === null) data.imageUrl = imageUrl;

      const updated = await prisma.product.update({
        where: { id },
        data
      });
      res.status(200).json(updated);
    } catch (e) {
      if (e.code === 'P2025') return res.status(404).json({ message: '상품 없음' });
      next(e);
    }
  })
  // 상품 삭제
  .delete(async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      await prisma.product.delete({ where: { id } });
      res.status(204).send();
    } catch (e) {
      if (e.code === 'P2025') return res.status(404).json({ message: '상품 없음' });
      next(e);
    }
  });

export default router;
