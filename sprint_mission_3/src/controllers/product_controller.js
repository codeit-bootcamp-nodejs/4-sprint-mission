// src/controllers/product.controller.js
import prisma from '../prisma/client.js';

// 상품 생성 API
export const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, tags, imageUrl } = req.body;
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        tags,
        imageUrl,
      },
    });
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

// 상품 목록 조회 API
export const getAllProducts = async (req, res, next) => {
  try {
    const offset = Math.max(0, parseInt(req.query.offset ?? '0', 10) || 0);
    const limitRaw = parseInt(req.query.limit ?? '10', 10);
    const limit = Math.min(50, Math.max(1, limitRaw || 10)); // 1~50로 클램프
    const search = (req.query.search ?? '').trim();
    const sort = req.query.sort;

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        }
      : undefined;

    const orderBy = sort === 'recent' ? { createdAt: 'desc' } : undefined;

    const products = await prisma.product.findMany({
      skip: offset,
      take: limit,
      where,
      orderBy,
      select: { id: true, name: true, price: true, createdAt: true },
    });

    res.json(products);
  } catch (err) {
    next(err);
  }
};

// 상품 상세 조회 API
export const getProductById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    const product = await prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        tags: true,
        createdAt: true,
        imageUrl: true,
      },
    });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    next(err);
  }
};

// 상품 수정 API
export const updateProduct = async (req, res, next) => {
  try {
    const updated = await prisma.product.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
    });
    res.json(updated);
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Product not found' });
    }
    next(err);
  }
};

// 상품 삭제 API
export const deleteProduct = async (req, res, next) => {
  try {
    await prisma.product.delete({ where: { id: parseInt(req.params.id) } });
    res.status(204).send();
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Product not found' });
    }
    next(err);
  }
};
