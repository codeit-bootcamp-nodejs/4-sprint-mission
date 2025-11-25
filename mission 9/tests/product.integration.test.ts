import request from "supertest";
import { app, server } from "../src/app";
import { loginAndGetToken } from "./helpers/auth";
import { ProductRepository } from "../src/repositories/productRepository";

describe("Product API Integration Test", () => {
  let accessToken: string;
  let userId: number;
  let productId: number;

  beforeAll(async () => {
    const tokens = await loginAndGetToken();
    accessToken = tokens.accessToken;
    userId = tokens.userId;

    if (!server.listening) {
      await new Promise<void>((resolve) => server.listen(0, resolve));
    }

    const productRepo = new ProductRepository();
    const product = await productRepo.createProduct({
      userId,
      name: "상품",
      description: "설명",
      price: 1000,
      tags: "상품",
    });
    productId = product.id; 
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
  });

  describe("Public Product API", () => {
    it("상품 목록 조회", async () => {
      const res = await request(app).get("/products").expect(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("상품 상세 조회", async () => {
      const res = await request(app)
        .get(`/products/${productId}`)
        .expect(200);

      expect(res.body).toHaveProperty("id", productId);
      expect(res.body).toHaveProperty("name", "상품");
    });
  });

  describe("Private Product API", () => {
    it("상품 수정", async () => {
      const res = await request(app)
        .patch(`/products/${productId}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send({ price: 2000 })
        .expect(200);

      expect(res.body).toHaveProperty("price", 2000);
    });

    it("상품 삭제", async () => {
      await request(app)
        .delete(`/products/${productId}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(204);

      await request(app).get(`/products/${productId}`).expect(404);
    });
  });
});
