import { PrismaClient } from '../src/generated';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// 비밀번호를 해시하는 유틸리티 함수
async function hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
}

async function main() {
    console.log(`[Seed] 시드 데이터 생성을 시작합니다...`);

    // 1. 사용자 A (알림 받을 사람)
    const userA_password = await hashPassword('password123');
    const userA = await prisma.user.upsert({
        where: { email: 'user-a@test.com' },
        update: {},
        create: {
            email: 'user-a@test.com',
            nickname: '알림받는_유저A',
            password: userA_password,
        },
    });

    // 2. 사용자 B (행동 하는 사람)
    const userB_password = await hashPassword('password123');
    const userB = await prisma.user.upsert({
        where: { email: 'user-b@test.com' },
        update: {},
        create: {
            email: 'user-b@test.com',
            nickname: '행동하는_유저B',
            password: userB_password,
        },
    });

    // 3. 게시글 1 (작성자: 사용자 A)
    const post1 = await prisma.post.upsert({
        where: { id: 1 }, // (id 대신 title 같은 유니크한 값으로 하셔도 됩니다)
        update: {},
        create: {
            title: '유저A의 테스트 게시글',
            content: '여기에 유저B가 댓글을 달면 유저A에게 알림이 갑니다.',
            authorId: userA.id,
        },
    });

    // 4. 상품 1 (판매자: 사용자 B)
    const product1 = await prisma.product.upsert({
        where: { id: 1 }, // (id 대신 title 같은 유니크한 값으로 하셔도 됩니다)
        update: {},
        create: {
            title: '유저A가 좋아요한 상품',
            description: '유저B(판매자)가 이 상품 가격을 바꾸면 유저A에게 알림이 갑니다.',
            price: 10000,
            ownerId: userB.id,
        },
    });

    // 5. 좋아요 1 (사용자 A가 상품 1을 좋아요)
    await prisma.productLike.upsert({
        where: {
            userId_productId: {
                userId: userA.id,
                productId: product1.id,
            },
        },
        update: {},
        create: {
            userId: userA.id,
            productId: product1.id,
        },
    });

    console.log(`[Seed] -------------------------------------`);
    console.log(`[Seed] ✨ 시드 데이터 생성 완료!`);
    console.log(`[Seed] 사용자 A (알림받음): ${userA.email} (pw: password123)`);
    console.log(`[Seed] 사용자 B (행동함): ${userB.email} (pw: password123)`);
    console.log(`[Seed] 게시글 1 (ID: ${post1.id}, 작성자: ${userA.nickname})`);
    console.log(`[Seed] 상품 1 (ID: ${product1.id}, 판매자: ${userB.nickname})`);
    console.log(`[Seed] 좋아요 1 (사용자A -> 상품1)`);
    console.log(`[Seed] -------------------------------------`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });