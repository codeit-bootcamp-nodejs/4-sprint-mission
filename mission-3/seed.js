import { PrismaClient } from '@prisma/client';
import productSeed from './seeds/product.js';
import articleSeed from './seeds/article.js';

const prisma = new PrismaClient();

async function main() {
//   await productSeed();
  await articleSeed();
}

main()
  .then(() => {
    console.log('🌱 시드 데이터 생성 완료');
  })
  .catch((e) => {
    console.error('❌ 시드 생성 중 에러 발생:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
