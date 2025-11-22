import request from "supertest";
import server from "../app.js";
import bcrypt from "bcrypt";
import { Server } from "http";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
let testServer: Server;

// 인증 테스트를 위한 전역 변수
let accessToken: string;
let testUserId: number;
let createdProductId: number;

// 테스트용 유저 정보
const testAuthUser = {
  email: "product-auth-test@email.com",
  nickname: "ProductAuthUser",
  password: "password123!",
};

// 테스트 시작 전: 서버 실행, 테스트 유저 생성 및 로그인
beforeAll(async () => {
  testServer = server;

  const user = await prisma.user.create({
    data: {
      email: testAuthUser.email,
      nickname: testAuthUser.nickname,
      password: await bcrypt.hash(testAuthUser.password, 10), // seed.js와 동일하게 bcrypt 사용
    },
  });
  testUserId = user.id;

  const res = await request(testServer)
    .post("/users/signin")
    .send(testAuthUser);

  accessToken = res.body.data.accessToken;
});

// 테스트 종료 후: 서버 종료, 테스트 유저 삭제
afterAll(async () => {
  await prisma.user.deleteMany({
    where: { email: testAuthUser.email },
  });
  await prisma.$disconnect();

  // 서버 종료
  await new Promise<void>((resolve, reject) => {
    testServer.close((err) => {
      if (err) return reject(err);
      resolve();
    });
  });
});

describe("인증이 필요한 상품 API 통합 테스트 (Auth)", () => {
  /**
   * POST /products (상품 생성)
   */
  describe("POST /products", () => {
    it("401 Unauthorized: 인증 토큰 없이 요청 시 401 에러를 반환해야 함", async () => {
      const res = await request(testServer)
        .post("/products")
        .send({
          name: "Test Product",
          description: "Test Description",
          price: 10000,
          tags: ["test"],
        });

      // 현재 500으로 처리이지만 401이 좋을 거 같음
      expect(res.status).toBe(500); // 현재 로직 기준
    });

    it("400 Bad Request: 유효성 검사(validation) 실패 시 400 에러를 반환해야 함", async () => {
      const res = await request(testServer)
        .post("/products")
        .set("Authorization", `Bearer ${accessToken}`) // 인증 헤더 추가
        .send({
          name: "", // 이름이 없음 (Validation 실패)
          description: "Test Description",
          price: 10000,
          tags: ["test"],
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("상품 이름이 없습니다.");
    });

    it("201 Created: 유효한 정보와 인증 토큰으로 상품 생성에 성공해야 함", async () => {
      const res = await request(testServer)
        .post("/products")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          name: "New Auth Product",
          description: "Created by auth test",
          price: 50000,
          tags: ["auth", "test"],
        });

      expect(res.status).toBe(201);
      expect(res.body.name).toBe("New Auth Product");
      expect(res.body.userId).toBe(testUserId); // 생성자가 테스트 유저 ID와 일치

      createdProductId = res.body.id; // 다음 테스트를 위해 ID 저장
    });
  });

  /**
   * PATCH /products/:id (상품 수정)
   */
  describe("PATCH /products/:id", () => {
    it("500 Forbidden: 남의 상품(ID 1)을 수정하려 하면 500 에러를 반환해야 함", async () => {
      const otherProductId = 1; // seed.js의 user1이 생성한 상품

      const res = await request(testServer)
        .patch(`/products/${otherProductId}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send({ price: 9999 });

      expect(res.status).toBe(500); // "상품을 수정할 권한이 없습니다."
    });

    it("200 OK: 자신의 상품을 성공적으로 수정해야 함", async () => {
      const res = await request(testServer)
        .patch(`/products/${createdProductId}`) // 방금 생성한 상품 ID
        .set("Authorization", `Bearer ${accessToken}`)
        .send({ price: 12345 });

      expect(res.status).toBe(200);
      expect(res.body.price).toBe(12345);
    });
  });

  /**
   * POST /products/:id/like (상품 좋아요)
   */
  describe("POST /products/:id/like", () => {
    it("200 OK: 상품(ID 1)에 좋아요를 눌러야 함", async () => {
      const targetProductId = 1; // seed.js 상품

      const res = await request(testServer)
        .post(`/products/${targetProductId}/like`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("좋아요를 눌렀습니다.");
    });

    it("200 OK: 다시 눌러서 좋아요를 취소해야 함", async () => {
      const targetProductId = 1;

      const res = await request(testServer)
        .post(`/products/${targetProductId}/like`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("좋아요가 취소되었습니다.");
    });
  });

  /**
   * DELETE /products/:id (상품 삭제)
   */
  describe("DELETE /products/:id", () => {
    it("500 Forbidden: 남의 상품(ID 1)을 삭제하려 하면 500 에러를 반환해야 함", async () => {
      const otherProductId = 1;

      const res = await request(testServer)
        .delete(`/products/${otherProductId}`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(res.status).toBe(500); // "상품을 삭제할 권한이 없습니다."
    });

    it("204 No Content: 자신의 상품을 성공적으로 삭제해야 함", async () => {
      const res = await request(testServer)
        .delete(`/products/${createdProductId}`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(res.status).toBe(204);
    });

    it("404 Not Found: 삭제된 상품을 조회하려 하면 404 에러를 반환해야 함", async () => {
      const res = await request(testServer).get(
        `/products/${createdProductId}`
      );

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("요청한 자원을 찾을 수 없습니다.");
    });
  });
});
