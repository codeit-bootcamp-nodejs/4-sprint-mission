import request from "supertest";
import { app } from "../../app.js";
import prisma from "../../prisma/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

describe("상품 API - 인증 필요 통합 테스트", () => {
  let authToken: string;
  let userId: number;
  let otherUserId: number;
  let otherUserToken: string;
  let testProductId: number;

  // 테스트 전 사용자 생성 및 로그인
  beforeAll(async () => {
    // 기존 테스트 데이터 정리
    await prisma.product.deleteMany({
      where: {
        User: {
          email: { in: ["producttest@example.com", "otheruser@example.com"] }
        }
      }
    });
    await prisma.user.deleteMany({
      where: {
        email: { in: ["producttest@example.com", "otheruser@example.com"] }
      }
    });

    // 테스트용 사용자 생성
    const user = await prisma.user.create({
      data: {
        email: "producttest@example.com",
        nickname: "productuser",
        password: await bcrypt.hash("password123", 10),
      },
    });
    userId = user.id;

    // 다른 사용자 생성 (권한 테스트용)
    const otherUser = await prisma.user.create({
      data: {
        email: "otheruser@example.com",
        nickname: "otheruser",
        password: await bcrypt.hash("password123", 10),
      },
    });
    otherUserId = otherUser.id;

    // JWT 토큰 생성
    authToken = jwt.sign(
      { userId: userId.toString(), email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    otherUserToken = jwt.sign(
      { userId: otherUserId.toString(), email: otherUser.email },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );
  });

  // 테스트 후 정리
  afterAll(async () => {
    await prisma.product.deleteMany({
      where: {
        userId: {
          in: [userId, otherUserId],
        },
      },
    });
    await prisma.user.deleteMany({
      where: {
        id: {
          in: [userId, otherUserId],
        },
      },
    });
  });

  describe("POST /product - 상품 등록", () => {
    it("인증된 사용자가 상품을 등록할 수 있어야 함", async () => {
      const productData = {
        title: "테스트 상품",
        content: "테스트 상품 설명",
        price: 10000,
      };

      const response = await request(app)
        .post("/api/product")
        .set("Authorization", `Bearer ${authToken}`)
        .send(productData)
        .expect(200);

      expect(response.body).toHaveProperty("message", "상품 등록 성공");
      expect(response.body.product).toHaveProperty("id");
      expect(response.body.product).toHaveProperty("title", productData.title);
      expect(response.body.product).toHaveProperty("content", productData.content);
      expect(response.body.product).toHaveProperty("price", productData.price);

      testProductId = response.body.product.id;
    });

    it("제목이 없으면 400 에러를 반환해야 함", async () => {
      const productData = {
        content: "테스트 상품 설명",
        price: 10000,
      };

      const response = await request(app)
        .post("/api/product")
        .set("Authorization", `Bearer ${authToken}`)
        .send(productData)
        .expect(400);

      expect(response.body).toHaveProperty("message");
    });

    it("가격이 없으면 400 에러를 반환해야 함", async () => {
      const productData = {
        title: "테스트 상품",
        content: "테스트 상품 설명",
      };

      const response = await request(app)
        .post("/api/product")
        .set("Authorization", `Bearer ${authToken}`)
        .send(productData)
        .expect(400);

      expect(response.body).toHaveProperty("message");
    });
  });

  describe("GET /product - 상품 목록 조회", () => {
    it("인증된 사용자가 자신의 상품 목록을 조회할 수 있어야 함", async () => {
      const response = await request(app)
        .get("/api/product")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty("message", "상품 조회 성공");
      expect(response.body).toHaveProperty("data");
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });
  });

  describe("PUT /product/:productId - 상품 수정", () => {
    it("상품 소유자가 자신의 상품을 수정할 수 있어야 함", async () => {
      const updateData = {
        title: "수정된 상품",
        content: "수정된 내용",
        price: 20000,
      };

      const response = await request(app)
        .put(`/api/product/${testProductId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty("message", "상품 정보 수정 성공");
      expect(response.body.data).toHaveProperty("title", updateData.title);
      expect(response.body.data).toHaveProperty("price", updateData.price);
    });

    it("다른 사용자가 상품을 수정하려고 하면 403 에러를 반환해야 함", async () => {
      const updateData = {
        title: "해킹 시도",
        content: "해킹 내용",
        price: 1,
      };

      const response = await request(app)
        .put(`/api/product/${testProductId}`)
        .set("Authorization", `Bearer ${otherUserToken}`)
        .send(updateData)
        .expect(403);

      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toContain("권한");
    });

    it("존재하지 않는 상품을 수정하려고 하면 404 에러를 반환해야 함", async () => {
      const updateData = {
        title: "존재하지 않는 상품",
        content: "내용",
        price: 10000,
      };

      const response = await request(app)
        .put("/api/product/99999")
        .set("Authorization", `Bearer ${authToken}`)
        .send(updateData)
        .expect(404);

      expect(response.body).toHaveProperty("message");
    });
  });

  describe("DELETE /product/:productId - 상품 삭제", () => {
    let deleteTestProductId: number;

    beforeEach(async () => {
      // 삭제 테스트용 상품 생성
      const product = await prisma.product.create({
        data: {
          title: "삭제 테스트 상품",
          content: "삭제될 상품",
          price: 5000,
          userId,
        },
      });
      deleteTestProductId = product.id;
    });

    it("상품 소유자가 자신의 상품을 삭제할 수 있어야 함", async () => {
      const response = await request(app)
        .delete(`/api/product/${deleteTestProductId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty("message");
      expect(response.body.product).toHaveProperty("id", deleteTestProductId);

      // 삭제 확인
      const deletedProduct = await prisma.product.findUnique({
        where: { id: deleteTestProductId },
      });
      expect(deletedProduct).toBeNull();
    });

    it("다른 사용자가 상품을 삭제하려고 하면 403 에러를 반환해야 함", async () => {
      // 삭제 테스트용 상품 생성
      const product = await prisma.product.create({
        data: {
          title: "다른 사용자 상품",
          content: "내용",
          price: 5000,
          userId,
        },
      });

      const response = await request(app)
        .delete(`/api/product/${product.id}`)
        .set("Authorization", `Bearer ${otherUserToken}`)
        .expect(403);

      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toContain("권한");

      // 정리
      await prisma.product.delete({ where: { id: product.id } });
    });

    it("존재하지 않는 상품을 삭제하려고 하면 404 에러를 반환해야 함", async () => {
      const response = await request(app)
        .delete("/api/product/99999")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(404);

      expect(response.body).toHaveProperty("message");
    });
  });
});

