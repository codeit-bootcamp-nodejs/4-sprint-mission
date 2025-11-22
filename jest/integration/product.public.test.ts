import request from "supertest";
import { app } from "../../app.js";

describe("상품 API - 인증 불필요 테스트 (인증 실패 케이스)", () => {
  describe("GET /product - 상품 목록 조회 (인증 필요)", () => {
    it("토큰 없이 요청 시 401 에러를 반환해야 함", async () => {
      const response = await request(app)
        .get("/product")
        .expect(401);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body.message).toContain("토큰");
    });

    it("잘못된 토큰으로 요청 시 401 에러를 반환해야 함", async () => {
      const response = await request(app)
        .get("/product")
        .set("Authorization", "Bearer invalid-token")
        .expect(401);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body.message).toContain("유효하지");
    });

    it("Bearer 형식이 아닌 토큰으로 요청 시 401 에러를 반환해야 함", async () => {
      const response = await request(app)
        .get("/product")
        .set("Authorization", "InvalidFormat token123")
        .expect(401);

      expect(response.body).toHaveProperty("success", false);
    });
  });

  describe("POST /product - 상품 등록 (인증 필요)", () => {
    it("토큰 없이 상품 등록 시 401 에러를 반환해야 함", async () => {
      const productData = {
        title: "테스트 상품",
        content: "테스트 내용",
        price: 10000,
      };

      const response = await request(app)
        .post("/product")
        .send(productData)
        .expect(401);

      expect(response.body).toHaveProperty("success", false);
    });
  });

  describe("PUT /product/:productId - 상품 수정 (인증 필요)", () => {
    it("토큰 없이 상품 수정 시 401 에러를 반환해야 함", async () => {
      const productData = {
        title: "수정된 상품",
        content: "수정된 내용",
        price: 20000,
      };

      const response = await request(app)
        .put("/product/1")
        .send(productData)
        .expect(401);

      expect(response.body).toHaveProperty("success", false);
    });
  });

  describe("DELETE /product/:productId - 상품 삭제 (인증 필요)", () => {
    it("토큰 없이 상품 삭제 시 401 에러를 반환해야 함", async () => {
      const response = await request(app)
        .delete("/product/1")
        .expect(401);

      expect(response.body).toHaveProperty("success", false);
    });
  });
});

