import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function clearDatabase() {
  await prisma.article.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
}
