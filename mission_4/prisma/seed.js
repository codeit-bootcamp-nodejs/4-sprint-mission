// prisma/seed.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // ------------------------------
  // Product 더미 데이터 생성
  // ------------------------------
  const product1 = await prisma.product.create({
    data: {
      name: "게이밍 노트북",
      description: "고성능 게이밍 및 작업용 노트북",
      price: 1800000,
      tags: ["노트북", "게이밍", "고성능",],
      comments: {
        create: [
          { name: "홍길동", content: "배틀그라운드도 잘 돌아가네요!" },
          { name: "김철수", content: "팬 소음이 조금 있지만 성능은 최고입니다." }
        ]
      }
    }
  });

  const product2 = await prisma.product.create({
    data: {
      name: "기계식 키보드",
      description: "청축 기계식 키보드, 타건감이 뛰어남",
      price: 120000,
      tags: ["키보드","기계식","청축",],
      comments: {
        create: [
          { name: "이영희", content: "타이핑할 맛이 납니다." }
        ]
      }
    }
  });

  // ------------------------------
  // Article 더미 데이터 생성
  // ------------------------------
  const article1 = await prisma.article.create({
    data: {
      title: "게이밍 PC 조립 가이드",
      content: "부품 선택부터 조립까지 단계별 설명...",
      comments: {
        create: [
          { name: "박영수", content: "이 글 덕분에 처음으로 PC를 조립했습니다." },
          { name: "최민지", content: "부품 추천이 매우 유용했습니다." }
        ]
      }
    }
  });

  const article2 = await prisma.article.create({
    data: {
      title: "2025년 인기 프로그래밍 언어 TOP 10",
      content: "올해 주목받는 프로그래밍 언어와 트렌드를 분석...",
      comments: {
        create: [
          { name: "장우진", content: "Rust가 상위권이라니 반갑네요!" }
        ]
      }
    }
  });

  // ------------------------------
  // Comment 모델 개별 생성 (Product/Article와 직접 연결)
  // ------------------------------
  await prisma.comment.create({
    data: {
      name: "손흥민",
      content: "이 제품은 가격 대비 성능이 좋습니다.",
      productId: product1.id
    }
  });

  await prisma.comment.create({
    data: {
      name: "유재석",
      content: "기사 내용이 깔끔하게 잘 정리되어 있네요.",
      articleId: article2.id
    }
  });

  console.log("시딩이 완료되었습니다.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
