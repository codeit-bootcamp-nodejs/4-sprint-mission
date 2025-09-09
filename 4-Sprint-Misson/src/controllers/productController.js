import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 상품 등록
export const createProduct = async (req, res) => {
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
};

// 상품 상세 조회
export const getProductById = async (req, res) => {
  const productId = Number(req.params.id);
  const userId = req.user?.id;

   try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) return res.status(404).json({ error: "상품 없음" });

    let isLiked = false;
    if (userId) {
      const like = await prisma.like.findUnique({
        where: { userId_productId: { userId, productId } },
      });
      isLiked = !!like;
    }

    res.json({ ...product, isLiked });
  } catch (err) {
    res.status(500).json({ error: "상품 조회 실패" });
  }
};

// 상품 수정
export const updateProduct = async (req, res) => {
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
};

// 상품 삭제
export const deleteProduct = async (req, res) => {
  const id = Number(req.params.id);

  try {
    const exists = await prisma.product.findUnique({ where: { id } });
    if (!exists) return res.status(404).json({ error: '상품 없음' });

    await prisma.product.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: '삭제 중 오류' });
  }
};

// 상품 목록 조회 (offset 기반 페이지네이션, 최신순 정렬)
export const getProducts = async (req, res) => {
  const {
    page = 1,
    pageSize = 10,
    sort = 'recent',
    search = '',
  } = req.query;

  const skip = (Number(page) - 1) * Number(pageSize);
  const take = Number(pageSize);

  try {
    const where = {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ],
    };

    const products = await prisma.product.findMany({
      where,
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

    const total = await prisma.product.count({ where });

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
};
