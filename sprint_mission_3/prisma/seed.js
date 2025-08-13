// prisma/seed.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Sample Products
  await prisma.product.createMany({
    data: [
      {
        name: 'iPhone 13',
        description: 'Used iPhone 13 in good condition',
        price: 800000,
        tags: ['electronics', 'phone'],
        imageUrl: '/uploads/sample1.jpg',
      },
      {
        name: 'MacBook Air M2',
        description: 'Latest MacBook Air with M2 chip',
        price: 1300000,
        tags: ['laptop', 'apple'],
        imageUrl: '/uploads/sample2.jpg',
      },
    ],
  });

  // Sample Articles
  await prisma.article.createMany({
    data: [
      {
        title: 'Welcome to the board',
        content: 'Feel free to post anything here.',
      },
      {
        title: 'Trade safely',
        content: 'Always meet in public when trading.',
      },
    ],
  });

  console.log('✅ Seed data inserted successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
