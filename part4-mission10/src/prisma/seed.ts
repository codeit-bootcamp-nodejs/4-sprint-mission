import bcrypt from 'bcrypt';
import { prisma } from '../lib/prismaClient.js';

const main = async () => {
  console.log('🔄 시드 시작...');

  // 0️⃣ 모든 댓글/게시글/상품은 매번 삭제 후 재생성
  await prisma.comment.deleteMany();
  await prisma.article.deleteMany();
  await prisma.product.deleteMany();
  console.log('🧹 product / article / comment 초기화 완료');

  // 1️⃣ 유저는 username unique 있으므로 upsert 가능 → 안전
  const hashedPassword1 = await bcrypt.hash('password1', 10);
  const hashedPassword2 = await bcrypt.hash('password2', 10);

  const user1 = await prisma.user.upsert({
    where: { username: 'testUser1' },
    update: {},
    create: {
      username: 'testUser1',
      email: 'test1@example.com',
      password: hashedPassword1,
      images: [],
    },
  });

  const user2 = await prisma.user.upsert({
    where: { username: 'testUser2' },
    update: {},
    create: {
      username: 'testUser2',
      email: 'test2@example.com',
      password: hashedPassword2,
      images: [],
    },
  });

  console.log('👤 유저 upsert 완료');

  // 2️⃣ 상품 재생성 (deleteMany 했으므로 create는 항상 성공)
  const product1 = await prisma.product.create({
    data: {
      name: 'Nintendo Switch2',
      description: '아 스위치2 갖고 싶다',
      price: 650000,
      tags: ['전자제품'],
      images: [],
      userId: user1.id,
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: 'PlayStation 5',
      description: '게임 끝판왕',
      price: 750000,
      tags: ['게임기'],
      images: [],
      userId: user2.id,
    },
  });

  const product3 = await prisma.product.create({
    data: {
      name: 'Xbox Series X',
      description: 'MS 게임기',
      price: 700000,
      tags: ['게임기'],
      images: [],
      userId: user1.id,
    },
  });

  console.log('🛒 상품 생성 완료');

  // 3️⃣ 게시글 재생성
  const article1 = await prisma.article.create({
    data: {
      title: '스위치2 솔직히 너무 비싼듯 ㅇㅇ',
      content: 'ㅈㄱㄴ',
      tags: ['리뷰'],
      userId: user2.id,
    },
  });

  const article2 = await prisma.article.create({
    data: {
      title: '플스5 성능 리뷰',
      content: '가격만 빼면 마음에 드네',
      tags: ['리뷰', '게임'],
      userId: user1.id,
    },
  });

  const article3 = await prisma.article.create({
    data: {
      title: '엑스박스 시리즈 X 후기',
      content: '엑스박스 쳤다...',
      tags: ['리뷰', '게임'],
      userId: user2.id,
    },
  });

  console.log('📝 게시글 생성 완료');

  // 4️⃣ 댓글 재생성
  await prisma.comment.createMany({
    data: [
      // Product1 댓글
      { content: '와 가격', userId: user2.id, productId: product1.id },
      {
        content: '스위치2 존버 대성공 ㅋㅋ',
        userId: user1.id,
        productId: product1.id,
      },

      // Product2
      {
        content: '플스5 진짜 사고 싶다',
        userId: user1.id,
        productId: product2.id,
      },

      // Product3
      { content: '엑박도 좋음', userId: user2.id, productId: product3.id },

      // Article1
      {
        content: 'ㄹㅇ 쉽지않음 거의 플스5급 아님?',
        userId: user1.id,
        articleId: article1.id,
      },
      {
        content: '플스5 프로 생각하면 또 선녀 같네',
        userId: user2.id,
        articleId: article1.id,
      },

      // Article2
      {
        content: '성능 리뷰 잘 봤습니다',
        userId: user2.id,
        articleId: article2.id,
      },

      // Article3
      { content: '엑박 후기 ㄳ', userId: user1.id, articleId: article3.id },
    ],
  });

  console.log('💬 댓글 생성 완료');
};

main()
  .then(() => {
    console.log('🎉 데이터베이스 시딩 완료.');
    return prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ 시딩 에러:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
