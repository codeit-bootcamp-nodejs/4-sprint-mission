import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

const main = async () => {
  const newProduct = await prisma.product.create({
    data: {
      name: 'Nintendo Switch2',
      description: '아 스위치2 갖고 싶다',
      price: 650000,
      tags: ['전자제품'],
    },
  });
  const newArticle = await prisma.article.create({
    data: {
      title: '스위치2 솔직히 너무 비싼듯 ㅇㅇ',
      content: 'ㅈㄱㄴ',
    },
  });
  await prisma.comment.create({
    data: {
      content: '와 가격',
      product: {
        connect: { id: newProduct.id },
      },
    },
  });

  await prisma.comment.create({
    data: {
      content: '스위치2 존버 대성공 ㅋㅋ',
      product: {
        connect: { id: newProduct.id },
      },
    },
  });

  await prisma.comment.create({
    data: {
      content: 'ㄹㅇ 쉽지않음 거의 플스5급 아님?',
      article: {
        connect: { id: newArticle.id },
      },
    },
  });

  await prisma.comment.create({
    data: {
      content: '플스5 프로 생각하면 또 선녀 같네',
      article: {
        connect: { id: newArticle.id },
      },
    },
  });
};

main()
  .then(() => {
    console.log('데이터베이스 시딩 완료.');
    return prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
