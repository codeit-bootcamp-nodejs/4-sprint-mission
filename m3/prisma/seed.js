import { PrismaClient } from '@prisma/client';
import { PRODUCTS, ARTICLES, COMMENTS } from './mock-data.js';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Start seeding...');

    // 기존 데이터를 모두 삭제하여 중복을 방지하고 깨끗한 상태로 시작합니다.
    // 외래 키 제약 조건 때문에 'comments' -> 'articles'/'products' 순서로 삭제해야 합니다.
    await prisma.comment.deleteMany({});
    await prisma.article.deleteMany({});
    await prisma.product.deleteMany({});
    console.log('Existing data deleted.');

    // PRODUCTS 데이터를 createMany로 한 번에 삽입하여 효율성을 높입니다.
    await prisma.product.createMany({
      data: PRODUCTS,
    });
    console.log('PRODUCTS data inserted.');

    // ARTICLES 데이터를 createMany로 한 번에 삽입합니다.
    await prisma.article.createMany({
      data: ARTICLES,
    });
    console.log('ARTICLES data inserted.');

    // COMMENTS 데이터를 createMany로 한 번에 삽입합니다.
    await prisma.comment.createMany({
      data: COMMENTS,
    });
    console.log('COMMENTS data inserted.');

    // --- 수동 시퀀스 카운터 재설정 ---
    // createMany는 시퀀스를 업데이트하지 않으므로, 다음 ID가 겹치지 않도록 수동으로 재설정합니다.

    // 1. Article 테이블 시퀀스 재설정
    const maxArticleId = await prisma.article.findMany({
      select: { id: true },
      orderBy: { id: 'desc' },
      take: 1,
    });
    if (maxArticleId.length > 0) {
      const nextId = maxArticleId[0].id + 1;
      await prisma.$executeRaw`SELECT setval('"Article_id_seq"', ${nextId}, false);`;
      console.log(`Article sequence counter reset to: ${nextId}`);
    }

    // 2. Product 테이블 시퀀스 재설정
    const maxProductId = await prisma.product.findMany({
      select: { id: true },
      orderBy: { id: 'desc' },
      take: 1,
    });
    if (maxProductId.length > 0) {
      const nextId = maxProductId[0].id + 1;
      await prisma.$executeRaw`SELECT setval('"Product_id_seq"', ${nextId}, false);`;
      console.log(`Product sequence counter reset to: ${nextId}`);
    }

    // 3. Comment 테이블 시퀀스 재설정
    const maxCommentId = await prisma.comment.findMany({
      select: { id: true },
      orderBy: { id: 'desc' },
      take: 1,
    });
    if (maxCommentId.length > 0) {
      const nextId = maxCommentId[0].id + 1;
      await prisma.$executeRaw`SELECT setval('"Comment_id_seq"', ${nextId}, false);`;
      console.log(`Comment sequence counter reset to: ${nextId}`);
    }
    // ------------------------------------

    console.log('Seeding finished.');
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
