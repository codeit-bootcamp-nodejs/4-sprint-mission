import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  // create two dummy users
  const password = await bcrypt.hash('password123', 10);
  const user1 = await prisma.user.create({
    data: {
      email: 'user1@example.com',
      nickname: 'Alice',
      password,
      image: 'https://i.pravatar.cc/150?u=user1@example.com',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'user2@example.com',
      nickname: 'Bob',
      password,
      image: 'https://i.pravatar.cc/150?u=user2@example.com',
    },
  });

  // create two dummy articles
  const article1 = await prisma.article.create({
    data: {
      title: 'Prisma is the best ORM',
      content:
        'Prisma makes database access easy with an intuitive data model and type-safety.',
      userId: user1.id,
    },
  });

  const article2 = await prisma.article.create({
    data: {
      title: 'Getting started with Next.js',
      content:
        'Next.js is a React framework for building full-stack web applications.',
      userId: user2.id,
    },
  });

  // create two dummy products
  const product1 = await prisma.product.create({
    data: {
      name: 'Laptop',
      description: 'A very powerful laptop for all your needs.',
      price: 1200,
      tags: ['electronics', 'computer'],
      userId: user1.id,
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: 'Coffee Mug',
      description: 'A mug to hold your favorite beverage.',
      price: 15,
      tags: ['kitchen', 'home'],
      userId: user2.id,
    },
  });

  // create comments
  await prisma.comment.create({
    data: {
      name: 'Commenter1',
      content: 'Great article!',
      userId: user2.id,
      articleId: article1.id,
    },
  });

  await prisma.comment.create({
    data: {
      name: 'Commenter2',
      content: 'I love this laptop!',
      userId: user1.id,
      productId: product1.id,
    },
  });

  console.log({ user1, user2, article1, article2, product1, product2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
