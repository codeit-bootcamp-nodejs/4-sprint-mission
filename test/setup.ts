import prisma from "../src/repository/prisma";

beforeAll(async () => {
  await prisma.$connect();
  await prisma.product.deleteMany();
  await prisma.article.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});
