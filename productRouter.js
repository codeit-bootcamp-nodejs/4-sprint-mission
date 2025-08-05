import { Prisma } from '@prisma/client';
import express from 'express';
import z from 'zod';

const productRouter = express.Router();

const createPorductSchema = z.object({
  name: z.string().min(1, { message: "이름을 입력해주세요" }),
  description: z.string().min(10, { message: "설명은 최소 10자 이상이어야 합니다." }).max(100, { message: "설명은 최대 100자까지 가능합니다." }),
  price: z.number().int().positive({ message: "가격은 양의 정수여야 합니다." }),
  tags: z.string().min(1, { message: "태그는 한개 이상이여야 합니다" }),
});

productRouter.route('/')
  .post(async(req, res) => { //Product 등록하기
    try {
      const validatedData = createPorductSchema.parse(req.body);    
    } catch (err) {
      res.status(404).json({ error: msg.error });
    };
    const { name, description, price, tags } = validatedData;

    try {
      const product = await Prisma.product.create ({
        data: {
          name,
          description,
          price,
          tags,
        },
      });
      res.json({ message: 'Complete to post your product!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to post product' });
    }
  })

  .get(async(req, res) => { //검색어로 Product 조회하기 및 전체 Product 조회하기
    try {
      const keyword = req.query.keyword;
      const products = await prisma.product.findMany({
        skip: (page - 1) * 5,
        take: 5,
         orderBy: {
          createdAt: 'asc',
        },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          tags: true,
          createdAt: true,
        },
        where: {
          OR: [
            {
              title: {
                contains: keyword,
              },
            },
            {
              description: {
                contains: keyword,
              },
            },
          ],
        },
      });
      res.status(201).json(products);
    } catch (error) {
      console.error(error);
      res.status(404).json({ error: `Can't find products`})
    }
  });

productRouter.route('/:id') 
  .patch(async(req, res) => { //id를 통해서 Product 수정하기
    const productId = Number(req.params.id);
    const { name, description, price, tags, updatedAt } = req.body;

    try{
        const updated = await prisma.product.update({
            where: { id: productId },
            data: {
                name,
                description,
                price,
                tags,
                updatedAt,
            },
        });
        res.json({ message: 'Complete to modify your product!' });
    } catch (err) {
        res.status(500).json({ error: `Product is not modified` });
    }
})

  .delete(async(req, res) => { //id를 통해서 Product 삭제하기
     const productId = Number(req.params.id);

    try {
        await prisma.product.delete({
            wehre: { id: productId },
        });
        res.json({ message: 'Product is deleted' });
    } catch (err) {
        res.status(404).json({ error: `Can't delete product` });
    }
})

  .get(async(req, res) => { //id를 통해서 Product 조회하기
    const productId = Number(req.params.id);

    try {
      const product = await prisma.product.findUnique({
        where: { id: productId },
        seledct: {
          id: true,
          name: true,
          description: true,
          price: true,
          tags: true,
          createdAt: true,
        },
      });
      res.json(product);
    } catch (err) {
      res.status(404).json({ error: `Can't find products`})
    }
  });

export default productRouter;
