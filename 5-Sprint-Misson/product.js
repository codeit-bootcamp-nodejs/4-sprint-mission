import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();


// 상품 등록 API
router.post('/', async (req, res) => {
  const { name, description, price, tags } = req.body;
  
  try {
    if (!name || !description || !price) {
      return res.status(400).json({ error: '요소 누락 됨' });
    }

    const product = await prisma.product.create({
      data: { name, description, price, tags },
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: '상품 등록 오류' });
  }
});


// 상품 상세 조회 API
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    const product = await prisma.product.findUnique({
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

    if (!product) {
      return res.status(404).json({ error: '상품을 찾을 수 없음.' });
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: '상품 조회 중 오류' });
  }
});


// 상품 수정 API
router.patch('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { name, description, price, tags } = req.body;

  try {
    const exists = await prisma.product.findUnique({ where: { id } });
    if (!exists) return res.status(404).json({ error: '상품 없음' });

    const product = await prisma.product.update({
      where: { id },
      data: { name, description, price, tags },
    });

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: '수정 중 오류' });
  }
});


// 상품 삭제 API
router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    const exists = await prisma.product.findUnique({ where: { id } });
    if (!exists) return res.status(404).json({ error: '상품 없음' });

    await prisma.product.delete({ where: { id } });
    res.status(204).send(); 
  } catch (err) {
    res.status(500).json({ error: '삭제 중 오류' });
  }
});


// 상품 목록 조회 API, offsset 방식 페이지네이션, 최신순 정렬
router.get('/', async (req, res) => {
  const {
    page = 1,
    pageSize = 10,
    sort = 'recent',
    search = '',
  } = req.query;
  
  //page와 pageSize로 offset 기반 페이지 나눔진행
  const skip = (Number(page) - 1) * Number(pageSize);
  const take = Number(pageSize);

  //검색, name 또는 description에 포함되면 해당 상품 검색
  // insensitive: 대소문자 무시
  try {
    const where = {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ],
    };

    const products = await prisma.product.findMany({
      where,
      //최신순 정렬
      orderBy: { createdAt: sort === 'recent' ? 'desc' : 'asc' },
      skip,
      take,
      select: {
        id: true,
        name: true,
        price: true,
        createdAt: true,
      },
    });

    //조건에 맞는 전체 데이터 수 산출
    const total = await prisma.product.count({ where });

    //상품 목록, pagination 내 정보 보이게
    res.status(200).json({
      data: products,
      pagination: {
        total,
        page: Number(page),
        pageSize: Number(pageSize),
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (err) {
    res.status(500).json({ error: '조회 오류' });
  }
});



export default router;
