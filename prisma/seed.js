import prisma from './prismaClient.js';

async function main() {
  await prisma.product.createMany({
    data: [
      {
        name: '중고 맥북',
        description: '깨끗하게 사용한 맥북입니다',
        price: 1200000,
        tags: ['노트북', '전자제품']
      },
      {
        name: '아이폰 13',
        description: '생활 기스 조금 있음',
        price: 850000,
        tags: ['스마트폰', '애플']
      }
    ]
  });
  console.log('시딩 완료!');
}

main()
  .catch((e) => {
    console.error(' 시딩 실패:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });