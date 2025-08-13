import express from 'express';
import { PrismaClient } from '@prisma/client';
import validateProduct from '../middlewares/validateProduct.js';

const router = express.Router();
const prisma = new PrismaClient()

router.post('/product', validateProduct, async (req, res) => {
  try {
    const product = await prisma.product.create({
      data: req.body,
    });
    res.status(201).json(product);
  } catch (error) {
    console.error('상품 등록 오류:', error);
    res.status(500).json({ error: '상품 등록 중 오류가 발생했습니다.' });
  }
});

router.get('/product/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: '올바른 상품 ID를 입력하세요.' });
  }

  try {
    const product = await prisma.product.findUniqueOrThrow({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        tags: true,
        createdAt: true,
      },
    });

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: '해당 상품을 찾을 수 없습니다.' });
  }
});

router.patch('/product/:id', validateProduct, async (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: '올바른 상품 ID를 입력하세요.' });
  }

  try {
    const updated = await prisma.product.update({
      where: { id },
      data: req.body,
    });

    res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: '상품을 찾을 수 없습니다.' });
  }
});

router.delete('/product/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: '올바른 상품 ID를 입력하세요.' });
  }

  try {
    await prisma.product.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: '상품을 찾을 수 없습니다.' });
  }
});

router.get('/product', async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = '',
    sort = 'recent',
  } = req.query;

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  try {
    const where = {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ],
    };

    const orderBy =
      sort === 'price'
        ? { price: 'asc' }
        : { createdAt: 'desc' }; // 기본 정렬: 최근 등록순

    const products = await prisma.product.findMany({
      where,
      skip,
      take,
      orderBy,
    });

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '상품 목록을 불러오는 데 실패했습니다.' });
  }
});

export default router;
