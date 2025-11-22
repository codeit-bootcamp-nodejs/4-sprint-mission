import request from "supertest";
import server from "../app.js";
import { Server } from "http";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
let testServer: Server;

// 인증 테스트를 위한 전역 변수
let accessToken: string;
let testUserId: number;
let createdArticleId: number;

// 테스트용 유저 정보 (이전 테스트와 충돌하지 않도록 이메일 변경)
const testAuthUser = {
  email: "article-auth-test@email.com",
  nickname: "ArticleAuthUser",
  password: "password123!",
};

// 테스트 시작 전: 서버 실행, 테스트 유저 생성 및 로그인
beforeAll(async () => {
  testServer = server;

  // 테스트 유저 생성
  const user = await prisma.user.create({
    data: {
      email: testAuthUser.email,
      nickname: testAuthUser.nickname,
      password: await bcrypt.hash(testAuthUser.password, 10),
    },
  });
  testUserId = user.id;

  // 2. 로그인하여 accessToken 획득
  const res = await request(testServer)
    .post("/users/signin")
    .send(testAuthUser);

  accessToken = res.body.data.accessToken;
});

// 테스트 종료 후 서버 종료, 테스트 유저 삭제 (게시글, 댓글 등은 Cascade로 자동 삭제됨)
afterAll(async () => {
  // 생성된 테스트 유저 삭제
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

describe("인증이 필요한 게시글 API 통합 테스트 (Auth)", () => {
  /**
   * POST /articles (게시글 생성)
   */
  describe("POST /articles", () => {
    it("500 Internal Error: 인증 토큰 없이 요청 시 500 에러를 반환해야 함", async () => {
      const res = await request(testServer).post("/articles").send({
        title: "Test Article",
        content: "Test Content",
      });

      // authMiddleware가 401 대신 throw new Error()를 하므로 500이 반환됨
      expect(res.status).toBe(500);
      expect(res.body.error).toBeDefined(); // "인증 정보가 없습니다."
    });

    it("400 Bad Request: 유효성 검사(validation) 실패 시 400 에러를 반환해야 함", async () => {
      const res = await request(testServer)
        .post("/articles")
        .set("Authorization", `Bearer ${accessToken}`) // 인증 헤더 추가
        .send({
          title: "", // 제목이 없음 (Validation 실패)
          content: "Test Content",
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("게시글의 제목이 없습니다.");
    });

    it("201 Created: 유효한 정보와 인증 토큰으로 게시글 생성에 성공해야 함", async () => {
      const res = await request(testServer)
        .post("/articles")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          title: "New Auth Article",
          content: "Created by auth test",
        });

      expect(res.status).toBe(201);
      expect(res.body.title).toBe("New Auth Article");
      expect(res.body.userId).toBe(testUserId); // 생성자가 테스트 유저 ID와 일치

      createdArticleId = res.body.id; // 다음 테스트를 위해 ID 저장
    });
  });

  /**
   * PATCH /articles/:id (게시글 수정)
   */
  describe("PATCH /articles/:id", () => {
    it("500 Forbidden: 남의 게시글(ID 1)을 수정하려 하면 500 에러를 반환해야 함", async () => {
      const otherArticleId = 1; // seed.js의 user2가 생성한 게시글

      const res = await request(testServer)
        .patch(`/articles/${otherArticleId}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send({ content: "Hacked content" });

      expect(res.status).toBe(500); // "게시글을 수정할 권한이 없습니다."
    });

    it("200 OK: 자신의 게시글을 성공적으로 수정해야 함", async () => {
      const res = await request(testServer)
        .patch(`/articles/${createdArticleId}`) // 방금 생성한 게시글 ID
        .set("Authorization", `Bearer ${accessToken}`)
        .send({ content: "Updated content" });

      expect(res.status).toBe(200);
      expect(res.body.content).toBe("Updated content");
    });
  });

  /**
   * POST /articles/:id/like (게시글 좋아요)
   */
  describe("POST /articles/:id/like", () => {
    it("200 OK: 게시글(ID 1)에 좋아요를 눌러야 함", async () => {
      const targetArticleId = 1; // seed.js 게시글

      const res = await request(testServer)
        .post(`/articles/${targetArticleId}/like`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("게시글을 좋아했습니다.");
    });

    it("200 OK: 다시 눌러서 좋아요를 취소해야 함", async () => {
      const targetArticleId = 1;

      const res = await request(testServer)
        .post(`/articles/${targetArticleId}/like`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("게시글 좋아요가 취소되었습니다.");
    });
  });

  /**
   * DELETE /articles/:id (게시글 삭제)
   */
  describe("DELETE /articles/:id", () => {
    it("500 Forbidden: 남의 게시글(ID 1)을 삭제하려 하면 500 에러를 반환해야 함", async () => {
      const otherArticleId = 1;

      const res = await request(testServer)
        .delete(`/articles/${otherArticleId}`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(res.status).toBe(500); // "게시글을 삭제할 권한이 없습니다."
    });

    it("204 No Content: 자신의 게시글을 성공적으로 삭제해야 함", async () => {
      const res = await request(testServer)
        .delete(`/articles/${createdArticleId}`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(res.status).toBe(204);
    });

    it("404 Not Found: 삭제된 게시글을 조회하려 하면 404 에러를 반환해야 함", async () => {
      const res = await request(testServer).get(
        `/articles/${createdArticleId}`
      );

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("요청한 자원을 찾을 수 없습니다.");
    });
  });
});
