import { PrismaClient } from '@prisma/client';
import express from 'express';
import { z } from 'zod';

const productRouter = express.Router();

const prisma = new PrismaClient();

const schema = z.object({ //유효성 검사 설정하기
  name: z.string().min(1, { message: "이름을 입력해주세요" }),
  description: z.string().min(10, { message: "설명은 최소 10자 이상이어야 합니다." }).max(100, { message: "설명은 최대 100자까지 가능합니다." }),
  price: z.number().int().positive({ message: "가격은 양의 정수여야 합니다." }),
  tags: z.string().min(1, { message: "태그는 한개 이상이여야 합니다" }),
});

productRouter.route('/')
  .post(async(req, res, next) => { // Zod로 유효성 검사에서 통과한 데이터를 product table에 post하기
    try {
      const validatedData = schema.parse(req.body);   
      const product = await prisma.product.create ({
        data: {
          name: validatedData.name,
          description: validatedData.description,
          price: validatedData.price,
          tags: validatedData.tags,
        },        
      });
      
      return res.status(201).json(product);
    } catch (err) {
        next(err);
    }
})

  .get(async(req, res, next) => { //page와 keyword query를 통해서 원하는 product 찾기
    try {
      const page = parseInt(req.query.page) || 1; //값이 없을 경우도 수식하기 위함
      const keyword = req.query.keyword || '';
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
    } catch (error) {
        next(err);
    }
  });

productRouter.route('/:id') 
  .patch(async(req, res, next) => { // Id를 통해서 product를 찾아내 수정하기
    const productId = Number(req.params.id);
    const validatedData = schema.parse(req.body);  

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
})

  .delete(async(req, res, next) => { // Id을 통해 product를 찾아내 삭제하기
     const productId = Number(req.params.id);

    try {
        await prisma.product.delete({
            where: { id: productId },
        });
        res.status(204).end();
    } catch (err) {
        next(err);
    }
})

  .get(async(req, res) => { //id를 통해  product 조회하기
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
  });

    productRouter.use((err, req, res, next) => { //에러 미드웨어 설정
      if (err instanceof z.ZodError) {
          return res.status(400).json({ error: err.errors });
      }
  
      if (err.code === 'P2025') {
          return res.status(404).json({ error: 'Record not found' });
      }
  
      console.error('unhandled Error:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    });
  

export default productRouter;
