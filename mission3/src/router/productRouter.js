import { PrismaClient } from '@prisma/client';
import express from 'express';
import z from 'zod';

const productRouter = express.Router();

const prisma = new PrismaClient();

const schema = z.object({ //유효성 검사 설정하기
  name: z.string().min(1, { message: "이름을 입력해주세요" }),
  description: z.string().min(10, { message: "설명은 최소 10자 이상이어야 합니다." }).max(100, { message: "설명은 최대 100자까지 가능합니다." }),
  price: z.number().int().positive({ message: "가격은 양의 정수여야 합니다." }),
  tags: z.string().min(1, { message: "태그는 한개 이상이여야 합니다" }),
});

productRouter.route('/')
  .post(async(req, res) => { // Zod로 유효성 검사에서 통과한 데이터를 product table에 post하기
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
      if (err instanceof z.ZodError) { //유효성 검사에 통과하지 못하면 400에러창이 출력
        console.error(err);
        res.status(400).json({ error: err. errors });
    }
    console.error(err);
    res.status(500).json({ error: 'Product is not posted' }); //그외는 500에러로 출력
  }
})

  .get(async(req, res) => { //page와 keyword query를 통해서 원하는 product 찾기
    try {
      const page = parseInt(req.query.page);
      const keyword = req.query.keyword;
      const where = keyword //name과 description에서 원하는 keyword가 들어간 데이터를 찾도록 만든 변수
      ? {
          OR: [
            {
              name: {
                contains: keyword,
              },
            },
            {
              description: {
                contains: keyword,
              },
            },
          ],
        }
      : undefined;

      const products = await prisma.product.findMany({
        skip: (page - 1) * 5,
        take: 5,
         orderBy: {  // 아스키 코드가 느린 순새대로 정렬하기(최신순)
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
        where
      });
      res.status(201).json(products);
    } catch (error) {
      console.error(error);
      res.status(404).json({ error: `Can't find products`})
    }
  });

productRouter.route('/:id') 
  .patch(async(req, res) => { // Id를 통해서 product를 찾아내 수정하기
    const productId = Number(req.params.id);
    const { name, description, price, tags } = req.body;

    try{
        const updated = await prisma.product.update({
            where: { id: productId },
            data: {
                name,
                description,
                price,
                tags,
            },
        });
        res.status(201).json(updated);
    } catch (err) {
        res.status(500).json({ error: `Product is not modified` });
    }
})

  .delete(async(req, res) => { // Id을 통해 product를 찾아내 삭제하기
     const productId = Number(req.params.id);

    try {
        await prisma.product.delete({
            where: { id: productId },
        });
        res.json({ message: 'Product is deleted' });
    } catch (err) {
        res.status(404).json({ error: `Can't delete product` });
    }
})

  .get(async(req, res) => { //id를 통해  article 조회하기
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
      res.status(201).json(product);
    } catch (err) {
      res.status(404).json({ error: `Can't find products`})
    }
  });

export default productRouter;
