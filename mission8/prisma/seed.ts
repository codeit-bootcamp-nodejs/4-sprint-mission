import { NotificationTypeEnum } from '../generated/prisma/enums.js';
import { appConfig } from '../src/config/app.config.js';
import prisma from '../src/utils/prisma.js';

import bcrypt from 'bcrypt';

async function main() {
  // ----------------------
  // 1. 유저
  // ----------------------
  const saltRounds = appConfig.bcryptSaltRounds;

  const user1Password = 'testuser1';
  const user2Password = 'testuser2';

  const user1HashedPassword = await bcrypt.hash(user1Password, saltRounds);
  const user2HashedPassword = await bcrypt.hash(user2Password, saltRounds);

  const user1 = await prisma.user.create({
    data: {
      username: '유저1',
      email: 'user1@test.com',
      hashedPassword: user1HashedPassword,
      lastLogin: new Date(),
    },
  });

  const user2 = await prisma.user.create({
    data: {
      username: '유저2',
      email: 'user2@test.com',
      hashedPassword: user2HashedPassword,
      lastLogin: new Date(),
    },
  });

  // ----------------------
  // 2. 상품
  // ----------------------
  const product1 = await prisma.product.create({
    data: {
      name: '상품이름1',
      description: '설명2',
      price: 1200000,
      tags: ['태그1', '태그2'],
      userId: user1.id,
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: '상품이름2',
      description: '설명',
      price: 2500000,
      tags: ['태그1', '태그2'],
      userId: user2.id,
    },
  });

  // ----------------------
  // 3. 게시글
  // ----------------------
  const post1 = await prisma.post.create({
    data: {
      title: '게시글 제목1',
      content: '게시글 내용1',
      userId: user1.id,
    },
  });

  const post2 = await prisma.post.create({
    data: {
      title: '게시글 제목2',
      content: '게시글 내용2',
      userId: user2.id,
    },
  });

  // ----------------------
  // 4. 댓글
  // ----------------------
  await prisma.postComment.createMany({
    data: [
      {
        content: '댓글 1',
        postId: post1.id,
        userId: user2.id,
      },
      {
        content: '댓글 2',
        postId: post2.id,
        userId: user1.id,
      },
    ],
  });

  // ----------------------
  // 5. 좋아요
  // ----------------------
  await prisma.productVote.create({
    data: {
      productId: product1.id,
      userId: user2.id,
    },
  });

  await prisma.postVote.create({
    data: {
      postId: post1.id,
      userId: user2.id,
    },
  });

  // ----------------------
  // 6. 알림
  // ----------------------
  await prisma.notification.createMany({
    data: [
      {
        userId: user1.id,
        type: NotificationTypeEnum.NEW_COMMENT,
        message: '새로운 댓글이 달렸습니다',
        createdAt: new Date(),
      },
      {
        userId: user2.id,
        type: NotificationTypeEnum.PRODUCT_PRICE_CHANGED,
        message: '가격이 변경되었습니다',
        createdAt: new Date(),
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
