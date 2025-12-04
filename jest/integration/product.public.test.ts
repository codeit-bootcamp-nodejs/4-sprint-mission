import request from "supertest";
import { app } from "../../app.js";

describe("상품 API - 인증 테스트", () => {
  describe("GET /api/product - 상품 목록 조회 (인증 불필요)", () => {
    it("토큰 없이도 상품 목록을 조회할 수 있어야 함", async () => {
      const response = await request(app)
        .get("/api/product");

      // 상품이 있으면 200, 없으면 404 (비즈니스 로직)
      expect([200, 404]).toContain(response.status);
    });
  });

  describe("POST /api/product - 상품 등록 (인증 필요)", () => {
    it("토큰 없이 상품 등록 시 401 에러를 반환해야 함", async () => {
      const productData = {
        title: "테스트 상품",
        content: "테스트 내용",
        price: 10000,
      };

      const response = await request(app)
        .post("/api/product")
        .send(productData)
        .expect(401);

      expect(response.body).toHaveProperty("message");
    });
  });

  describe("PUT /api/product/:productId - 상품 수정 (인증 필요)", () => {
    it("토큰 없이 상품 수정 시 401 에러를 반환해야 함", async () => {
      const productData = {
        title: "수정된 상품",
        content: "수정된 내용",
        price: 20000,
      };

      const response = await request(app)
        .put("/api/product/1")
        .send(productData)
        .expect(401);

      expect(response.body).toHaveProperty("message");
    });
  });

  describe("DELETE /api/product/:productId - 상품 삭제 (인증 필요)", () => {
    it("토큰 없이 상품 삭제 시 401 에러를 반환해야 함", async () => {
      const response = await request(app)
        .delete("/api/product/1")
        .expect(401);

      expect(response.body).toHaveProperty("message");
    });
  });
});
