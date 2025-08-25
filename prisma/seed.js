import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding 시작');

  // 샘플 상품 생성
  const product1 = await prisma.product.create({
    data: {
      name: '고성능 게이밍 마우스',
      description: '정밀한 컨트롤을 위한 최신 히어로 센서 탑재',
      price: 89000,
      tags: ['게이밍', '마우스', 'IT'],
    },
  });
  console.log(`상품 등록: ${product1.name}`);

  // 샘플 게시글 생성
  const article1 = await prisma.article.create({
    data: {
      title: '라이브러리와 프레임워크 비교',
      content: ' 라이프러리와 프레임워크를 알아봅시다.',
    },
  });
  console.log(`게시글 작성: ${article1.title}`);

  // 샘플 댓글 생성
  const comment1 = await prisma.comment.create({
    data: { content: '이 마우스 정말 좋아 보이네요! 구매 고려해봐야겠어요.' },
  });
  const comment2 = await prisma.comment.create({
    data: { content: '배송은 얼마나 걸리나요?' },
  });
  const comment3 = await prisma.comment.create({
    data: {
      content:
        '라이브러리와 프레임워크의 차이를 쉽게 설명해주셔서 좋았습니다. 감사합니다!',
    },
  });
  console.log('3개의 댓글 작성');

  // 상품 - 댓글 연결
  await prisma.productComment.create({
    data: {
      productId: product1.id,
      commentId: comment1.id,
    },
  });
  await prisma.productComment.create({
    data: {
      productId: product1.id,
      commentId: comment2.id,
    },
  });
  console.log(`상품에 2개의 댓글이 연결되었습니다. : ${product1.name}`);

  // 게시글 - 댓글 연결
  await prisma.articleComment.create({
    data: {
      articleId: article1.id,
      commentId: comment3.id,
    },
  });
  console.log(`게시글과 1개의 댓글이 연결되었습니다. : ${article1.title}`);

  console.log('Seeding 종료');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
