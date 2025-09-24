import prisma from "../src/lib/prisma.js";
import bcrypt from "bcrypt";

async function main() {
  // 1. 기본 유저 생성
  const hashedPassword = await bcrypt.hash("password123", 10);

  const user = await prisma.user.upsert({
    where: { email: "seed@example.com" },
    update: {},
    create: {
      email: "seed@example.com",
      nickname: "seedUser",
      password: hashedPassword,
      provider: "local",
    },
  });

  // 2. 게시글 시드 데이터
  await prisma.article.createMany({
    data: [
      {
        title: "첫 번째 시드 게시글",
        content: "테스트용 게시글입니다.",
        userId: user.id,
      },
      {
        title: "두 번째 시드 게시글",
        content: "또 다른 게시글입니다.",
        userId: user.id,
      },
    ],
  });

  // 3. 상품 + 이미지 시드 데이터
  const productA = await prisma.product.create({
    data: {
      name: "시드 상품 A",
      description: "테스트용 상품 A",
      price: 10000,
      tags: ["tag1", "tag2"],
      userId: user.id,
    },
  });

  const productB = await prisma.product.create({
    data: {
      name: "시드 상품 B",
      description: "테스트용 상품 B",
      price: 20000,
      tags: ["tag3"],
      userId: user.id,
    },
  });

  // 4. 이미지 시드
  const image1 = await prisma.image.create({
    data: { url: "https://via.placeholder.com/300x200?text=Product+A" },
  });

  const image2 = await prisma.image.create({
    data: { url: "https://via.placeholder.com/300x200?text=Product+B" },
  });

  // 5. ProductImage 연결
  await prisma.productImage.createMany({
    data: [
      { productId: productA.id, imageId: image1.id },
      { productId: productB.id, imageId: image2.id },
    ],
  });

  console.log("✅ Seed 데이터 생성 완료");
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
