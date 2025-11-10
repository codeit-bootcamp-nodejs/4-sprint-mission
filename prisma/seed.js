import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.product.create({
    data: {
      name: "상품 예시",
      description: "상품 설명",
      price: 10000,
      tags: ["전자기기", "중고"],
    },
  });

  await prisma.article.create({
    data: {
      title: "게시글 제목",
      content: "게시글 내용",
    },
  });
}

main()
  .then(() => {
    console.log("시드 완료!");
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
  });
