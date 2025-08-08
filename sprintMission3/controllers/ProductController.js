import * as dotenv from 'dotenv';
import express, { application } from 'express';
import { PrismaClient } from '@prisma/client/extension';

dotenv.config();

const app = express();

const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// 상품 등록
app.post('/products', async (req, res) => {
  const { name, description, price, tags } = req.body;
  try {
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price,
        tags,
      },
    });
    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '상품을 등록할 수 없습니다.' });
  }
});

// 상품 상세 조회
app.get('/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const products = await prisma.product.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    if (products) {
      res.json(products);
    } else {
      res.status(404).json({ error: '상품을 찾을 수 없습니다.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '상품을 조회할 수 없습니다.' });
  }
});

// 상품 수정
app.patch('/products/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, price, tags } = req.body;

  const dataToUpdate = {};
  if (name !== undefined) dataToUpdate.name = name;
  if (description !== undefined) dataToUpdate.description = description;
  if (price !== undefined) dataToUpdate.price = price;
  if (tags !== undefined) dataToUpdate.tags = tags;

  try {
    const updateProducts = await prisma.product.update({
      where: {
        id: parseInt(id),
      },
      data: dataToUpdate,
    });
    res.json(updateProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '상품을 수정할 수 없습니다.' });
  }
});

// 상품 삭제
app.delete('/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.product.delete({
      where: {
        id: parseInt(id),
      },
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '상품을 삭제할 수 없습니다.' });
  }
});

// 상품 목록 조회
app.get('/products', async (req, res) => {
  const page = parseInt(req.query.page || '1');
  const limit = parseInt(req.query.limit || '10');
  const search = req.query.search;

  if (page < 1 || limit < 1) {
    return res.status(400).json({ error: '페이지 설정이 잘못되었습니다.' });
  }

  const offset = (page - 1) * limit;

  // 검색어가 있을 때 where 조건
  const whereCondition = search
    ? {
        OR: [
          { name: { contains: search } },
          { description: { contains: search } },
        ],
      }
    : {};

  try {
    const [products, totalCont] = await prisma.product.$transaction([
      prisma.product.findMany({
        where: whereCondition,
        select: {
          id: true,
          name: true,
          price: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      prisma.product.count({ where: whereCondition }),
    ]);

    // 전체 페이지 수 계산
    const totalPages = Math.ceil(totalCont / limit);

    res.json({
      data: products,
      pagination: {
        page,
        limit,
        totalCont,
        totalPages,
      },
    });
  } catch (error) {
    console.error(error);
  }
});
