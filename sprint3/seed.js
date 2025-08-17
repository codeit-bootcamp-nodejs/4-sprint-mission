import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.product.create({
    data: {
      name: 'Sample Product',
      description: 'This is a seeded product',
      price: 100.0,
      tags: ['sample', 'seeded'],
    },
  });

  await prisma.article.create({
    data: {
      title: 'Sample Article',
      content: 'This is a seeded article',
    },
  });

  await prisma.productComment.create({
    data: {
      content: 'This is a sample comment for product',
      productId: (await prisma.product.findFirst()).id,
    },
  });

  await prisma.articleComment.create({
    data: {
      content: 'This is a sample comment for article',
      articleId: (await prisma.article.findFirst()).id,
    },
  });

  console.log('Database seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });