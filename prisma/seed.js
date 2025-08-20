import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Products
  await prisma.product.createMany({
    data: [
      {
        name: '게이밍 키보드',
        description: '청축 기계식, 사용감 적음',
        price: 59000,
        tags: ['키보드', '게이밍'],
        imageUrl: null
      },
      {
        name: '중고 모니터 27인치',
        description: '무결점, 스탠드 포함',
        price: 129000,
        tags: ['모니터'],
        imageUrl: null
      }
    ]
  });

  // Articles
  await prisma.article.createMany({
    data: [
      { title: '커뮤니티 이용 규칙', content: '서로 예의 지켜요' },
      { title: '판매 사기 예방법', content: '에스크로 사용 권장' }
    ]
  });

  // Comments
  const p1 = await prisma.product.findFirst();
  const a1 = await prisma.article.findFirst();
  if (p1) {
    await prisma.productComment.createMany({
      data: [
        { productId: p1.id, content: '가격 흥정 가능한가요?' },
        { productId: p1.id, content: '직거래 가능한가요?' }
      ]
    });
  }
  if (a1) {
    await prisma.articleComment.createMany({
      data: [
        { articleId: a1.id, content: '좋은 정보 감사합니다.' },
        { articleId: a1.id, content: '필독하겠습니다.' }
      ]
    });
  }
}

main()
  .then(() => console.log('Seed completed'))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
