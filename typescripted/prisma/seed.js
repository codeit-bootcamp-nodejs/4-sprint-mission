"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_js_1 = __importDefault(require("../src/lib/prisma.js"));
async function main() {
    try {
        //await prisma.tag.createMany({
        //data: [{ name: "example1" }, { name: "example2" }, { name: "example3" }],
        //});
        //const user = [
        //{
        //nickname: "j",
        //},
        // ]
    
        const products = [
            {
                name: "Product A",
                description: "설명 A",
                price: 10000,
                ownerId: 1, // 이미 있는 유저 ID
                productTags: { create: [{ tagId: 1 }, { tagId: 2 }] },
            },
            {
                name: "Product B",
                description: "설명 B",
                price: 20000,
                ownerId: 1,
                productTags: { create: [{ tagId: 3 }] },
            },
        ];
        //for (const u of user){
        //const customer = await prisma.user.create({ data: u });
        //console.log("✅ Seeded user:");
        //}
        for (const prod of products) {
            const p = await prisma_js_1.default.product.create({ data: prod });
            console.log("✅ Seeded product:");
        }
    }
    catch (error) {
        console.error(error.code, error.meta);
    }
    finally {
        await prisma_js_1.default.$disconnect();
    }
}
main();
