import { PrismaClient } from "../src/generated/prisma/index.js";

const prisma = new PrismaClient();

async function main() {
    console.log("시딩을 시작합니다.");
    
    // Product 데이터 생성
    await prisma.product.create({
        data: {
            name: "키보드",
            description: "청축 키보드이고 거의 새상품입니다.",
            price: 150000,
            tags: ["전자기기", "컴퓨터", "액세서리"],
        },
    });

    await prisma.product.create({
        data: {
            name: "컴퓨터",
            description: "급처합니다. 내고 안됨",
            price: 200000,
            tags: ["전자기기", "컴퓨터", "주변기기"],
        },
    });

    await prisma.article.create({
        data: {
            title: "첫 게시글",
            content: "안녕하세요 테스트 게시물입니다.",
        },
    });
    console.log("시딩이 완료되었습니다.");
}

main()
    .catch((e)=> {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });