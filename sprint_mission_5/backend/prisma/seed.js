// prisma/seed.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

async function main() {
  // Check if data already exists
  const existingUsers = await prisma.user.count();
  if (existingUsers > 0) {
    console.log('Data already exists, skipping seed...');
    return;
  }

  console.log('Seeding database...');

  // Sample Users
  const hashedPassword1 = await bcrypt.hash('password123', 10);
  const hashedPassword2 = await bcrypt.hash('password456', 10);
  const hashedPassword3 = await bcrypt.hash('password789', 10);

  const user1 = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      nickname: 'Alice',
      password: hashedPassword1,
      image: '/uploads/alice.jpg',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'bob@example.com',
      nickname: 'Bob',
      password: hashedPassword2,
      image: '/uploads/bob.jpg',
    },
  });

  const user3 = await prisma.user.create({
    data: {
      email: 'charlie@example.com',
      nickname: 'Charlie',
      password: hashedPassword3,
    },
  });

  // Sample Products
  const product1 = await prisma.product.create({
    data: {
      name: 'iPhone 13 Pro',
      description: 'Used iPhone 13 Pro in excellent condition. 256GB storage, includes original charger and case.',
      price: 850000,
      tags: ['electronics', 'phone', 'apple', 'smartphone'],
      imageUrl: '/uploads/iphone13.jpg',
      userId: user1.id,
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: 'MacBook Air M2',
      description: 'Latest MacBook Air with M2 chip, 16GB RAM, 512GB SSD. Perfect for development and design work.',
      price: 1350000,
      tags: ['laptop', 'apple', 'computer', 'macbook'],
      imageUrl: '/uploads/macbook.jpg',
      userId: user2.id,
    },
  });

  const product3 = await prisma.product.create({
    data: {
      name: 'Gaming Chair',
      description: 'Ergonomic gaming chair with lumbar support. Very comfortable for long coding sessions.',
      price: 200000,
      tags: ['furniture', 'gaming', 'chair', 'ergonomic'],
      imageUrl: '/uploads/gaming-chair.jpg',
      userId: user1.id,
    },
  });

  const product4 = await prisma.product.create({
    data: {
      name: 'Sony WH-1000XM5',
      description: 'Noise-canceling wireless headphones. Perfect sound quality for music and calls.',
      price: 350000,
      tags: ['electronics', 'headphones', 'sony', 'wireless'],
      imageUrl: '/uploads/sony-headphones.jpg',
      userId: user3.id,
    },
  });

  // Sample Articles
  const article1 = await prisma.article.create({
    data: {
      title: '환영합니다! 중고나라에 오신 것을 환영합니다',
      content: `안녕하세요! 중고나라 커뮤니티에 오신 것을 환영합니다.

여기서는 안전하고 신뢰할 수 있는 중고 거래를 할 수 있습니다.

**거래 시 주의사항:**
1. 반드시 공개된 장소에서 만나세요
2. 물품을 직접 확인하고 거래하세요
3. 의심스러운 거래는 피하세요
4. 개인정보는 함부로 공유하지 마세요

모든 분들의 안전한 거래를 위해 함께 노력해주세요!`,
      userId: user1.id,
    },
  });

  const article2 = await prisma.article.create({
    data: {
      title: '안전한 거래를 위한 팁',
      content: `중고 거래 시 안전을 위한 몇 가지 팁을 공유합니다:

**판매자를 위한 팁:**
- 상품 사진을 여러 각도에서 찍어 올리세요
- 상품의 상태를 정확히 기재하세요
- 실제 사용 기간과 하자 유무를 명시하세요

**구매자를 위한 팁:**
- 상품을 직접 보고 확인하세요
- 가격이 너무 저렴하다면 의심해보세요
- 판매자의 평판을 확인하세요

**공통 팁:**
- 카페, 지하철역 등 사람이 많은 곳에서 거래하세요
- 현금 거래를 권장합니다
- 거래 내역을 기록해두세요`,
      userId: user2.id,
    },
  });

  const article3 = await prisma.article.create({
    data: {
      title: '이번 주 인기 상품 소개',
      content: `이번 주에 가장 인기가 많았던 상품들을 소개합니다!

**전자제품 카테고리:**
- iPhone 13 시리즈: 여전히 인기!
- MacBook Air M2: 개발자들 사이에서 인기
- 게이밍 노트북: 재택근무 증가로 수요 상승

**생활용품 카테고리:**
- 에어프라이어: 1인 가구 증가로 인기
- 의자/책상: 홈오피스 구축 수요 증가

좋은 가격에 좋은 상품 많이 올라오고 있으니 자주 확인해주세요!`,
      userId: user3.id,
    },
  });

  // Sample Comments
  await prisma.comment.createMany({
    data: [
      {
        content: '정말 좋은 가격이네요! 직거래 가능한가요?',
        userId: user2.id,
        productId: product1.id,
      },
      {
        content: '상태가 어떤가요? 스크래치는 없나요?',
        userId: user3.id,
        productId: product1.id,
      },
      {
        content: '유용한 정보 감사합니다!',
        userId: user1.id,
        articleId: article2.id,
      },
      {
        content: '저도 최근에 안전거래로 좋은 경험했어요',
        userId: user3.id,
        articleId: article2.id,
      },
      {
        content: 'MacBook 정말 추천합니다! 성능 좋아요',
        userId: user1.id,
        productId: product2.id,
      },
    ],
  });

  // Sample Likes
  await prisma.like.createMany({
    data: [
      {
        userId: user2.id,
        productId: product1.id,
      },
      {
        userId: user3.id,
        productId: product1.id,
      },
      {
        userId: user1.id,
        productId: product2.id,
      },
      {
        userId: user3.id,
        productId: product2.id,
      },
      {
        userId: user2.id,
        productId: product4.id,
      },
      {
        userId: user1.id,
        articleId: article2.id,
      },
      {
        userId: user3.id,
        articleId: article2.id,
      },
      {
        userId: user2.id,
        articleId: article3.id,
      },
    ],
  });

  console.log('✅ Seed data inserted successfully');
  console.log(`👥 Created ${await prisma.user.count()} users`);
  console.log(`📱 Created ${await prisma.product.count()} products`);
  console.log(`📝 Created ${await prisma.article.count()} articles`);
  console.log(`💬 Created ${await prisma.comment.count()} comments`);
  console.log(`❤️ Created ${await prisma.like.count()} likes`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
