import { PrismaClient } from "@prisma/client"; // PrismaClient 틀(클래스) 불러오기
import { PRODUCT } from "./mock.js";

const prisma = new PrismaClient // 틀로 DB 작업을 할 수 있는 객체(인스턴스) 생성

async function main() {
    await prisma.product.deleteMany()
    await prisma.product.createMany({
        data: PRODUCT,
        skipDuplicates: true,    
    })
}

main() // 시딩이 되면 DB랑 연결 끊는 코드
    .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });