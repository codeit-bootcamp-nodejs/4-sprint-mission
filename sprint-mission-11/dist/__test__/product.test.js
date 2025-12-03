"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const app_1 = __importDefault(require("../app"));
describe("Unauthorized Product Test", () => {
    let productId;
    beforeAll(async () => {
        await prisma_1.default.product.deleteMany({});
        await prisma_1.default.user.deleteMany({});
        const user = await prisma_1.default.user.create({
            data: {
                email: "test@test.com",
                nickname: "nick",
                password: "pass",
            },
        });
        const product = await prisma_1.default.product.create({
            data: {
                name: "test",
                price: 10,
                ownerId: user.id,
            },
        });
        productId = product.id;
    });
    test("GET /list", async () => {
        const response = await (0, supertest_1.default)(app_1.default).get("/products/list").expect(200);
        expect(response.body.length).toBeGreaterThanOrEqual(1);
    });
    afterAll(async () => {
        await prisma_1.default.$disconnect();
    });
});
describe("Authorized Product Test", () => {
    let tokenHeader;
    let productId;
    beforeAll(async () => {
        await prisma_1.default.product.deleteMany({});
        await prisma_1.default.user.deleteMany({});
        const user = await prisma_1.default.user.create({
            data: {
                email: "test@test.com",
                nickname: "nick",
                password: "pass",
            },
        });
        const product = await prisma_1.default.product.create({
            data: {
                name: "testproduct",
                price: 10,
                ownerId: user.id,
            },
        });
        productId = product.id;
        const createUser = await (0, supertest_1.default)(app_1.default)
            .post("/users/register")
            .send({
            email: "test123@test.com",
            password: "password",
            nickname: "helloWorld",
        })
            .expect(201);
        const loginUser = await (0, supertest_1.default)(app_1.default)
            .post("/users/login")
            .send({
            email: "test123@test.com",
            password: "password",
        })
            .expect(200);
        const token = loginUser.body.data.accessHeader;
        tokenHeader = "Bearer " + token;
    });
    test("GET /detail", async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .get(`/products/detail/${productId}`)
            .set("Authorization", tokenHeader)
            .expect(200);
        expect(response.body.id).toEqual(productId);
        expect(response.body.name).toEqual("testproduct");
        expect(response.body.price).toBeGreaterThan(0);
    });
    test("POST /product", async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .post("/products")
            .send({
            name: "Test_Product",
            description: "Test_Description",
            price: 10000,
            tags: ["test_tag"],
        })
            .set("Authorization", tokenHeader)
            .expect(201);
    });
    test("POST /product 코멘트", async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .post("/products/comments/" + productId)
            .send({
            content: "내용",
        })
            .set("Authorization", tokenHeader)
            .expect(201);
        expect(response.body.data.content).toEqual("내용");
    });
    test("PATCH /product", async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .patch("/products/" + productId)
            .send({
            name: "Test_Product_patch",
            description: "Test_Description_patch",
            price: 50000,
        })
            .set("Authorization", tokenHeader)
            .expect(200);
        expect(response.body.data.name).toEqual("Test_Product_patch");
        expect(response.body.data.description).toEqual("Test_Description_patch");
        expect(response.body.data.price).toEqual(50000);
    });
    test("PATCH /product 코멘트", async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .patch("/products/comments/" + productId)
            .send({
            content: "새 내용",
        })
            .set("Authorization", tokenHeader)
            .expect(200);
        expect(response.body.data.content).toEqual("새 내용");
    });
    test("DELETE /product", async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .delete("/products/" + productId)
            .set("Authorization", tokenHeader)
            .expect(200);
    });
});
//# sourceMappingURL=product.test.js.map