import { connect } from "http2";
import prisma from "../src/lib/prisma.js";
import { Prisma } from "@prisma/client";

async function main() {
  try {
    await prisma.productTag.deleteMany();
    await prisma.product.deleteMany();
    await prisma.article.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.user.deleteMany();

  

    await prisma.tag.createMany({
    data: [
      { name: "example1" }, // id=1
      { name: "example2" }, // id=2
      { name: "example3" }  // id=3
    ]
  });
    const user1 = await prisma.user.create({
      data: {  nickname: "jun", email: "lee@example.com", password: "123924va" },
    });
    const user2 = await prisma.user.create({
      data: {
        nickname: "kiki",
        email: "kiki@example.com",
        password: "123924vas",
      },
    });

    const articles= await prisma.article.createMany({
      data: [
        {
          title: "any",
          content: "any",
          ownerId: user1.id,
        },
      ]
    });
    const products = [
      {
        name: "Product A",
        description: "설명 A",
        price: 10000,
        owner: { connect: { id: 1} }, // 이미 있는 유저 ID
        productTags: {
          create: [
            { tags: { connect: { id: 1} } },
            { tags: { connect: { id:  2} } },
          ],
        },
      },
      {
        name: "Product B",
        description: "설명 B",
        price: 20000,
        owner: { connect: { id: 2} },
        productTags:{
          create:[
            {tags: {connect:{ id: 3}}}
          ]
        }
      },
    ];

    for (const prod of products) {
      const p = await prisma.product.create({ data:prod });
      console.log("✅ Seeded product:");
    }
  } catch (error: any) {
    console.error(error.code, error.meta);
  } finally {
    await prisma.$disconnect();
  }
}
main();
