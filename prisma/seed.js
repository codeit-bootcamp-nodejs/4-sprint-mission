const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create Products
  await prisma.product.createMany({
    data: [
      {
        name: '게이밍 마우스',
        description: '고성능 게이밍 마우스입니다. RGB 조명이 특징입니다.',
        price: 50000,
        tags: ['게이밍', '마우스', 'RGB'],
      },
      {
        name: '기계식 키보드',
        description: '청축 기계식 키보드입니다. 타건감이 뛰어납니다.',
        price: 120000,
        tags: ['기계식키보드', '청축', '게이밍'],
      },
    ],
    skipDuplicates: true, // Skip if already exists
  });

  // Create Articles
  await prisma.article.createMany({
    data: [
      {
        title: '첫 번째 게시글',
        content: '안녕하세요! 자유게시판의 첫 번째 글입니다.',
      },
      {
        title: 'Prisma 사용법 질문',
        content: 'Prisma로 댓글 기능을 구현하는 방법이 궁금합니다.',
      },
    ],
    skipDuplicates: true,
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
