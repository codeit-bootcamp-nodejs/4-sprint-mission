import express from 'express';
import prisma from '../lib/prisma.js';
import passport from '../lib/passport/index.js';
import { z } from 'zod';

const router = express.Router();

const schema = z.object({ //유효성 검사 설정하기
  name: z.string().min(1, { message: "이름을 입력해주세요" }),
  description: z.string().min(10, { message: "설명은 최소 10자 이상이어야 합니다." }).max(100, { message: "설명은 최대 100자까지 가능합니다." }),
  price: z.number().int().positive({ message: "가격은 양의 정수여야 합니다." }),
  tags: z.string().min(1, { message: "태그는 한개 이상이여야 합니다" }),
});

router.post(
  '/products',
  passport.authenticate('access-token', { session: false }),
  createProduct
);
router.get('/products', getProducts);
router.patch(
  '/products/:id',
  passport.authenticate('access-token', { session: false }),
  modifyProduct
);
router.delete('/products/:id',
    passport.authenticate('local', { session: false }),
    deleteProduct
);
router.get('/products/:id',
    passport.authenticate('access-token', { session: false }),
    getDetailProduct
);

async function createProduct(req, res, next) {
try {
      const validatedData = schema.parse(req.body);   
      const user = req.user;
      const product = await prisma.product.create ({
        data: {
          name: validatedData.name,
          description: validatedData.description,
          price: validatedData.price,
          tags: validatedData.tags,
          userId: user.id
        },        
      });
      
      return res.status(201).json(product);
    } catch (err) {
        next(err);
    }
}

async function getProducts(req, res, next) {
try {
      const page = parseInt(req.query.page) || 1; //값이 없을 경우도 수식하기 위함
      const keyword = req.query.keyword ? decodeURIComponent(req.query.keyword) : '';
      const where = keyword //name과 description에서 원하는 keyword가 들어간 데이터를 찾도록 만든 변수
      ? {
          OR: [
            {
              name: {
                contains: keyword,
                mode: 'insensitive', //대소문자 구분 없이 검색하기 위해
              },
            },
            {
              description: {
                contains: keyword,
                mode: 'insensitive',
              },
            },
          ],
        }
      : {}; //기본값 {}으로 빈 객체를 수식하기 위함

      const products = await prisma.product.findMany({
        skip: (page - 1) * 5,
        take: 5,
         orderBy: {  // 최신 순서대로 정렬하기(최신순)
          createdAt: 'desc',
        },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          tags: true,
          createdAt: true,
        },
        where,
      });

      res.status(200).json(products);
    } catch (err) {
        next(err);
    }
}

async function modifyProduct(req, res, next) {
    const productId = Number(req.params.id);
    const validatedData = schema.parse(req.body);
    const user = req.user;
    const check = await prisma.product.findUnique({
      where: { id: productId }
    });
    
    if (user.Id !== check.userId) {
      return res.status(404).json({ message: 'User not matched'})
    }

    try{
        const updated = await prisma.product.update({
            where: { id: productId },
            data: {
                name: validatedData.name,
                description: validatedData.description,
                price: validatedData.price,
                tags: validatedData.tags,
            },
        });
        res.status(201).json(updated);
    } catch (err) {
        next(err);
    }
}

async function deleteProduct(req, res, next) {
    const productId = Number(req.params.id);
    const user = req.user;
    const check = await prisma.product.findUnique({
      where: { id: productId }
    });
    
    if (user.Id !== check.userId) {
      return res.status(404).json({ message: 'User not matched'})
    }

    try {
        await prisma.product.delete({
            where: { id: productId },
        });
        res.status(204).end();
    } catch (err) {
        next(err);
    }
}

async function getDetailProduct(req, res, next) {
    const productId = Number(req.params.id);

    try {
      const product = await prisma.product.findUnique({
        where: { id: productId },
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
        return res.status(404).json({ error: 'Product not found'});
      }
      res.status(200).json(product);
    } catch (err) {
        next(err);
    }
}

    router.use((err, req, res, next) => { //에러 미드웨어 설정
      if (err instanceof z.ZodError) {
          return res.status(400).json({ error: err.errors });
      }
  
      if (err.code === 'P2025') {
          return res.status(404).json({ error: 'Record not found' });
      }
  
      console.error('unhandled Error:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    });
  

export default router;
