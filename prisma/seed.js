import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Product 하나 생성
  const product = await prisma.product.create({
    data: {
      name: "시딩 상품",
      description: "상품 설명",
      price: 19900,
      tags: ["전자제품", "할인"],
    },
  });

  // Article 하나 생성
  const article = await prisma.article.create({
    data: {
      title: "자유게시판 글",
      content: "어쩌구 저쩌구",
    },
  });

  // 각각에 연결된 Comment 생성
  await prisma.comment.createMany({
    data: [
      {
        content: "상품 댓글 어쩌구",
        productId: product.id,
      },
      {
        content: "게시글 댓글 어쩌구",
        articleId: article.id,
      },
    ],
  });
}

main()
  .then(() => {
    console.log("🌱 DB Seed 완료");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
