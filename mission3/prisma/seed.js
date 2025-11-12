import { PrismaClient } from "@prisma/client";

import * as dotenv from 'dotenv';
dotenv.config();
const prisma = new PrismaClient();

const main = async () => {
   
    const newArticle = await prisma.article.create({
        data:{
            title:"제목",
            content:"아무내용"
        }
    })

    const targetId = newArticle.id;
    const commentTargetType = "article";

    const data = {
        title: "댓글",
        content: "내용입니다",
        ...(commentTargetType === "article"
        ? { article: { connect: { id: targetId } } }
        : { product: { connect: { id: targetId } } }),
    };
     const newComment = await prisma.comment.create({ data });

    console.log("✅ 시드 데이터 생성 완료:");
    console.log({ article: newArticle, comment: newComment });
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });