require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // 모든 상품 댓글 삭제
    await prisma.productComment.deleteMany();
    // 모든 게시글 댓글 삭제
    await prisma.articleComment.deleteMany();
    // 모든 상품 삭제
    await prisma.product.deleteMany();
    // 모든 게시글 삭제
    await prisma.article.deleteMany();

    // 첫 번째 상품 생성
    const p1 = await prisma.product.create({
        data: {
            name: '맥북 프로 14',
            description: 'M2 Pro, 16GB, 512GB — 생활기스 조금',
            price: 2200000,
            tags: ['노트북', '애플', '중고'],
            images: []
        }
    });
    // 두 번째 상품 생성
    const p2 = await prisma.product.create({
        data: {
            name: '게이밍 마우스',
            description: '초경량, 클릭감 좋음',
            price: 45000,
            tags: ['주변기기'],
            images: []
        }
    });

    // 첫 번째 게시글 생성
    const a1 = await prisma.article.create({ data: { title: '첫 글', content: '안녕하세요. 자유게시판 시작!' } });
    // 두 번째 게시글 생성
    const a2 = await prisma.article.create({ data: { title: '질문 있어요', content: '노드 배포 팁 공유 부탁.' } });

    // 상품 댓글 여러 개 생성
    await prisma.productComment.createMany({
        data: [
            { content: '가격 네고 가능할까요?', productId: p1.id },
            { content: '관심 있어요. 직거래 되나요?', productId: p1.id },
            { content: '사용감 어느 정도인가요?', productId: p2.id }
        ]
    });

    // 게시글 댓글 여러 개 생성
    await prisma.articleComment.createMany({
        data: [
            { content: '환영합니다!', articleId: a1.id },
            { content: '추천이요', articleId: a2.id }
        ]
    });

    // 완료 메시지 출력
    console.log(' Seeded');
}

main().catch(e => {
    console.error(e);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
});
