import { PrismaClient } from '@prisma/client';

export async function clearDatabase(prisma: PrismaClient) {
  await prisma.comment.deleteMany();
  await prisma.product.deleteMany();
  await prisma.article.deleteMany();
  await prisma.user.deleteMany();
}
