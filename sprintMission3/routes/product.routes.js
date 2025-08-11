import express from 'express';
import prisma from '../prisma/prismaClient.js';
import { validateProduct } from '../middlewares/validate.js';

const router = express.Router();

// 상품 등록
router.post('/', validateProduct, async (req, res, next) => {
  try {
    const { name, description, price, tags } = req.body;
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price: Number(price),
        tags: tags || [],
      },
    });
    res.status(201).json(newProdcut);
  } catch (error) {
    next (error);
  }
});

// 전체 상품 조회
router.get('/', async (req, res, next) => {
  try {
    const { offset = 0, limit = 10, search = '' } =req.query;
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
       },
       orderBy: { createdAt: 'desc'},
       skip: Number(offset),
       take: Number(limit),
       select: {
        id: true,
        name: true,
        price: true,
        createdAt: true,
       },
    });
    res.status(200).json(products);
  } catch (error) {
    next (error);
  }
});


// 상품 상세 조회
router.get('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: '유효한 숫자 ID를 입력하세요.' });
    }
    const prodcut = await prisma.product.findUnique({ 
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
      return res.status(404).json({ error: '상품을 찾을 수 없습니다.' })
    }
    
    res.status(200).json(product);
  } catch (error) {
    next (error);
  }
})

// 상품 수정
router.patch('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { name, description, price, tags } = req.body;
    if (isNaN(id)) {
      return res.status(400).json({ error: '유효한 ID를 입력해주세요.' });
    }
    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct) {
      return res.status(404).json({ error: '상품을 찾을 수 없습니다.' });
    }
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = Number(price);
    if (tags !== undefined) updateData.tags = tags;
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData,
    });
    res.status(200).json(updatedProduct);
  } catch (error) {
    next (error);
  }
});

// 상품 삭제
router.delete('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: '유효한 ID를 입력해주세요. '});
    }
    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct) {
      return res.status(404).json({ error: '삭제할 상품을 찾을 수 없습니다. '});
    }
    await prisma.product.delete({ where: { id } });
    res.status(200).json({ message: `상품(id: ${id})이 성공적으로 삭제되었습니다.`});
  } catch (error) {
    next (error);
  }
});


export default router;