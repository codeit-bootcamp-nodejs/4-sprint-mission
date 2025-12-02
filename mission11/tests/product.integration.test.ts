import request from "supertest";
import { app, server } from "../src/app";
import { ProductRepository } from "../src/repositories/productRepository";
import { UserRepository } from "../src/repositories/userRepository";
import bcrypt from "bcrypt";

describe("Product API Integration Test", () => {
  let accessToken: string;
  let userId: number;
  let productId: number;

  beforeAll(async () => {
    if (!server.listening) {
      await new Promise<void>((resolve) => server.listen(0, resolve));
    }

    // 1. 테스트 전용 유저 생성
    const userRepo = new UserRepository();
    const testEmail = `test_${Date.now()}@example.com`;
    const hashedPassword = await bcrypt.hash("test1234", 10);

    const user = await userRepo.createUser(
      testEmail,
      "테스트유저",
      hashedPassword
    );
    userId = user.id;

    // 2. 로그인 후 accessToken 획득
    const loginRes = await request(app)
      .post("/users/login")
      .send({
        email: testEmail,
        password: "test1234",
      })
      .expect(200);

    accessToken = loginRes.body.accessToken;

    // 3. 제품 생성
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
    const productRepo = new ProductRepository();
    const userRepo = new UserRepository();

    // 생성된 상품 삭제 (이미 API 테스트로 삭제됐다면 catch 후 무시)
    if (productId) {
      try {
        await productRepo.deleteProduct(productId);
      } catch (e) {}
    }

    // 생성된 유저 삭제
    if (userId) {
      try {
        await userRepo.deleteUser(userId);
      } catch (e) {}
    }

    // 서버 종료
    await new Promise<void>((resolve, reject) =>
      server.close((err) => (err ? reject(err) : resolve()))
    );
  });

  describe("Public Product API", () => {
    it("상품 목록 조회", async () => {
      const res = await request(app).get("/products").expect(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("상품 상세 조회", async () => {
      const res = await request(app).get(`/products/${productId}`).expect(200);

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
