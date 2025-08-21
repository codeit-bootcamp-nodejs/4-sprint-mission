
//////////////////////////////////////////////////////////////시딩 코드
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.product.createMany({
    data: [
      {
        name: "새상품 아이폰 15 Pro",
        description: "한 번도 사용하지 않은 미개봉 아이폰입니다.",
        price: 1500000,
        tags: ["스마트폰", "애플", "미개봉"]
      },
      {
        name: "의자",
        description: "사용감 있음",
        price: 20000,
        tags: ['가구']
      },
    ]
  });
  console.log("Seeded products");
}

main().finally(() => prisma.$disconnect());

////////////////////////////////////////////////////////////////////////POST삼품 등록
const express = require('express');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient(); 
const port = 3000; 

app.use(express.json());

app.post('/products', async (req, res) => {
    const { name, description, price, tags } = req.body; 

    if (!name || !description || !price || !tags) {
      return res.status(400).json({ message: '필수 입력값이 누락되었어요. 😤 (name, description, price, tags)' });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        tags, 
      },
    });

    res.status(201).json(product); 
  } catch (error) {
    console.error('상품 등록 실패:', error); 
    res.status(500).json({ message: '상품 등록 중에 서버 에러가 발생했어요. ㅠㅠ', error: error.message });
  }
);

////////////////////////////////////////////////////////////////////////POST삼품 등록
app.post('/products', async (req, res) => {
  const product = await prisma.product.create({
    { name, description, price, tags }: req.body,
  });
  res.status(201).send(user);
});