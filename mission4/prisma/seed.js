import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();
async function main() {
  const user = await prisma.user.create({
    data: {
      email: "jun@example.com",
      nickname: "Jun",
      password: "hashed_pw"
    }
  });
  await prisma.article.create({
    data: {
      title: "첫 번째 게시글",
      content: "테스트용 게시글 내용",
      owner: {
        connect: { id: user.id }  // User 모델에서 nickname이 @unique여야 함
      },
      createdAt: new Date(),
    },
  });

  await prisma.product.create({
    data: {
      name: "테스트 상품",
      description: "테스트 상품 설명",
      price: 1000,
      createdAt: new Date(),
    },
  });

  console.log("DB Seed 완료!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });