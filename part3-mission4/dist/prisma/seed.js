import 'dotenv/config';
import { prisma } from '../lib/prismaClient.js';
import bcrypt from 'bcrypt';
const main = async () => {
    // 1️⃣ 유저 시드
    const hashedPassword1 = await bcrypt.hash('password1', 10);
    const hashedPassword2 = await bcrypt.hash('password2', 10);
    const user1 = await prisma.user.create({
        data: {
            username: 'testuser1',
            email: 'test1@example.com',
            password: hashedPassword1,
            images: [],
        },
    });
    const user2 = await prisma.user.create({
        data: {
            username: 'testuser2',
            email: 'test2@example.com',
            password: hashedPassword2,
            images: [],
        },
    });
    // 2️⃣ 상품 시드 (총 3개)
    const product1 = await prisma.product.create({
        data: {
            name: 'Nintendo Switch2',
            description: '아 스위치2 갖고 싶다',
            price: 650000,
            tags: ['전자제품'],
            images: [],
            user: { connect: { id: user1.id } },
        },
    });
    const product2 = await prisma.product.create({
        data: {
            name: 'PlayStation 5',
            description: '게임 끝판왕',
            price: 750000,
            tags: ['게임기'],
            images: [],
            user: { connect: { id: user2.id } },
        },
    });
    const product3 = await prisma.product.create({
        data: {
            name: 'Xbox Series X',
            description: 'MS 게임기',
            price: 700000,
            tags: ['게임기'],
            images: [],
            user: { connect: { id: user1.id } },
        },
    });
    // 3️⃣ 게시글 시드 (총 3개)
    const article1 = await prisma.article.create({
        data: {
            title: '스위치2 솔직히 너무 비싼듯 ㅇㅇ',
            content: 'ㅈㄱㄴ',
            tags: ['리뷰'],
            user: { connect: { id: user2.id } },
        },
    });
    const article2 = await prisma.article.create({
        data: {
            title: '플스5 성능 리뷰',
            content: '가격만 빼면 마음에 드네',
            tags: ['리뷰', '게임'],
            user: { connect: { id: user1.id } },
        },
    });
    const article3 = await prisma.article.create({
        data: {
            title: '엑스박스 시리즈 X 후기',
            content: '엑스박스 쳤다...',
            tags: ['리뷰', '게임'],
            user: { connect: { id: user2.id } },
        },
    });
    // 4️⃣ 댓글 시드
    await prisma.comment.createMany({
        data: [
            // Product1 댓글
            { content: '와 가격', userId: user2.id, productId: product1.id },
            {
                content: '스위치2 존버 대성공 ㅋㅋ',
                userId: user1.id,
                productId: product1.id,
            },
            // Product2 댓글
            {
                content: '플스5 진짜 사고 싶다',
                userId: user1.id,
                productId: product2.id,
            },
            // Product3 댓글
            { content: '엑박도 좋음', userId: user2.id, productId: product3.id },
            // Article1 댓글
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
            // Article2 댓글
            {
                content: '성능 리뷰 잘 봤습니다',
                userId: user2.id,
                articleId: article2.id,
            },
            // Article3 댓글
            { content: '엑박 후기 ㄳ', userId: user1.id, articleId: article3.id },
        ],
    });
};
main()
    .then(() => {
    console.log('데이터베이스 시딩 완료.');
    return prisma.$disconnect();
})
    .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
//# sourceMappingURL=seed.js.map