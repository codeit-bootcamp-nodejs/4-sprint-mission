import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const article = await prisma.article.create({
    data: {
      title: '중고 노트북 팁',
      article: '좋은 중고 노트북을 고르는 방법에 대해 소개합니다.',
    },
  });

  await prisma.product.create({
    data: {
      name: '맥북 프로 14인치',
      description: '2021년형, 상태 A급',
      price: 1700000,
      tags: ['노트북', '애플'],
      articleId: article.id,
    },
  });

  await prisma.product.create({
    data: {
      name: 'LG 그램 16',
      description: '얇고 가볍습니다.',
      price: 1300000,
      tags: ['노트북', 'LG'],
      articleId: article.id,
    },
  });

  console.log('✅ article + Product 시딩 완료');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
