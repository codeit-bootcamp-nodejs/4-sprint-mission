import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient(); // Prisma 인스턴스 생성

async function main() {
  await prisma.Product.createMany({
    data: [
      {
        name: '맥북에어 m3 15인치',
        description:
          '2024년 구매, 16GB RAM / 256GB SSD / 사이클 10회, 실사용 7개월, 잔기스 없음, 풀박스 구성품.',
        price: 1300000,
        tags: '전자기기',
      },
    ],
  });

  await prisma.Article.createMany({
    data: [{ title: '반갑습니다', content: '안녕하세요 처음 뵙겠습니다.' }],
  });
}

main()
  .then()
  .catch((error) => console.error(error))
  .finally(() => prisma.$disconnect());
