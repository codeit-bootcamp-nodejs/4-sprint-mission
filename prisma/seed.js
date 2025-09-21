const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create Products
  const product1 = await prisma.product.create({
    data: {
      name: '노트북',
      description: '고성능 노트북입니다.',
      price: 1500000,
      tags: ['electronics', 'computer'],
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: '키보드',
      description: '기계식 키보드입니다.',
      price: 100000,
      tags: ['electronics', 'accessory'],
    },
  });

  // Create Articles
  const article1 = await prisma.article.create({
    data: {
      title: '첫 번째 게시글',
      content: '이것은 첫 번째 게시글의 내용입니다.',
    },
  });

  const article2 = await prisma.article.create({
    data: {
      title: '두 번째 게시글',
      content: '이것은 두 번째 게시글의 내용입니다.',
    },
  });

  // Create Product Comments
  await prisma.productComment.create({
    data: {
      comment: '이 노트북 정말 좋네요!',
      productId: product1.id,
    },
  });

  // Create Article Comments
  await prisma.articleComment.create({
    data: {
      content: '좋은 글 감사합니다.',
      articleId: article1.id,
    },
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
