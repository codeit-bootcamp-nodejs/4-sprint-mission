import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding 시작...');

  // 샘플 유저 2명 생성 (비밀번호는 bcrypt로 해싱)
  const hashedPassword1 = await bcrypt.hash('password123', 10);
  const user1 = await prisma.user.create({
    data: {
      email: 'user1@email.com',
      nickname: '개발왕팬더',
      password: hashedPassword1,
    },
  });

  const hashedPassword2 = await bcrypt.hash('password456', 10);
  const user2 = await prisma.user.create({
    data: {
      email: 'user2@email.com',
      nickname: '코딩천재라이언',
      password: hashedPassword2,
    },
  });
  console.log(`유저 생성 완료: ${user1.nickname}, ${user2.nickname}`);

  // user1이 작성한 샘플 상품 생성
  const product1 = await prisma.product.create({
    data: {
      name: '초고성능 게이밍 마우스',
      description: '정밀한 컨트롤을 위한 최신 히어로 센서가 탑재되었습니다.',
      price: 120000,
      tags: ['게이밍', 'IT', '마우스'],
      userId: user1.id, // user1의 ID를 작성자로 연결
    },
  });
  console.log(`상품 생성 완료: "${product1.name}" by ${user1.nickname}`);

  // user2가 작성한 샘플 게시글 생성
  const article1 = await prisma.article.create({
    data: {
      title: 'Node.js와 Prisma로 만드는 효율적인 백엔드',
      content:
        'Prisma는 타입스크립트와의 호환성이 뛰어나 개발 경험을 향상시킵니다.',
      userId: user2.id, // user2의 ID를 작성자로 연결
    },
  });
  console.log(`게시글 생성 완료: "${article1.title}" by ${user2.nickname}`);

  // 샘플 댓글 생성 및 연결

  await prisma.comment.create({
    data: {
      content: '이 마우스 정말 좋아 보이네요! 구매 고려해봐야겠습니다.',
      userId: user2.id,
      productId: product1.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: '좋은 정보 감사합니다! 저도 Prisma를 사용해봐야겠어요.',
      userId: user1.id,
      articleId: article1.id,
    },
  });
  console.log('댓글 2개 생성 및 연결 완료.');

  // 샘플 좋아요 데이터 생성

  await prisma.productLike.create({
    data: {
      userId: user2.id,
      productId: product1.id,
    },
  });
  console.log(
    `${user2.nickname}님이 "${product1.name}" 상품에 '좋아요'를 눌렀습니다.`,
  );

  await prisma.articleLike.create({
    data: {
      userId: user1.id,
      articleId: article1.id,
    },
  });
  console.log(
    `${user1.nickname}님이 "${article1.title}" 게시글에 '좋아요'를 눌렀습니다.`,
  );

  console.log('Seeding 성공적으로 완료!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
