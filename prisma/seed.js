//////////////////////////////////////////////////////////////시딩 코드
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.product.createMany({
    data: [
      {
        name: "새상품 아이폰 15 Pro",
        description: "한 번도 사용하지 않은 미개봉 아이폰입니다.",
        price: 1500000,
        tags: ["스마트폰", "애플", "미개봉"]
      },
      {
        name: "의자",
        description: "사용감 있음",
        price: 20000,
        tags: ['가구']
      },
    ]
  });
  console.log("Seeded products");
}


main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });