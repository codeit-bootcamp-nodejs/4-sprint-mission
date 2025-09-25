import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const seed = async () => {
  console.log("Start seeding ...");

  await prisma.article.create({
    data: {
      title: "게시글",
      content: "내용",
    },
  });

  await prisma.product.create({
    data: {
      name: "상품",
      price: 10000,
      tags: ["tag1", "tag2"],
    },
  });

  console.log(`✅ Seeding finished.`);
};

seed().then(() => prisma.$disconnect());
