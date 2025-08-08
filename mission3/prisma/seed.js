import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const main = async () => {
  await prisma.product.create({
    data: {
      name: '디지몬피규어',
      description: '가슴이 웅장해지는 오메가몬과 디아블로몬의 전투장면의 표현한 피규어',
      price: 80000,
      tags: '장식',
    },
  });
  await prisma.article.create({
    data: {
        title: 'Article test',
        content: 'Article 테스트 글입니다.',
    },
  });
};


main().then(() => prisma.$disconnect());