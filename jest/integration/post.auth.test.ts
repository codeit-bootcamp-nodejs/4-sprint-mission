import request from "supertest";
import { app } from "../../app.js";
import prisma from "../../prisma/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

describe("게시글 API - 인증 필요 통합 테스트", () => {
  let authToken: string;
  let userId: number;
  let otherUserId: number;
  let otherUserToken: string;
  let testPostId: number;

  // 테스트 전 사용자 생성 및 로그인
  beforeAll(async () => {
    // 기존 테스트 데이터 정리
    await prisma.post.deleteMany({
      where: {
        User: {
          email: { in: ["posttest@example.com", "otherpostuser@example.com"] }
        }
      }
    });
    await prisma.user.deleteMany({
      where: {
        email: { in: ["posttest@example.com", "otherpostuser@example.com"] }
      }
    });

    // 테스트용 사용자 생성
    const user = await prisma.user.create({
      data: {
        email: "posttest@example.com",
        nickname: "postuser",
        password: await bcrypt.hash("password123", 10),
      },
    });
    userId = user.id;

    // 다른 사용자 생성 (권한 테스트용)
    const otherUser = await prisma.user.create({
      data: {
        email: "otherpostuser@example.com",
        nickname: "otherpostuser",
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
    await prisma.post.deleteMany({
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

  describe("POST /post - 게시글 작성", () => {
    it("인증된 사용자가 게시글을 작성할 수 있어야 함", async () => {
      const postData = {
        title: "테스트 게시글",
        content: "테스트 게시글 내용입니다.",
      };

      const response = await request(app)
        .post("/api/post")
        .set("Authorization", `Bearer ${authToken}`)
        .send(postData)
        .expect(200);

      expect(response.body).toHaveProperty("message", "게시글 등록 성공");
      expect(response.body.data).toHaveProperty("id");
      expect(response.body.data).toHaveProperty("title", postData.title);
      expect(response.body.data).toHaveProperty("content", postData.content);

      testPostId = response.body.data.id;
    });

    it("제목이 없으면 에러를 반환해야 함", async () => {
      const postData = {
        content: "내용만 있는 게시글",
      };

      const response = await request(app)
        .post("/api/post")
        .set("Authorization", `Bearer ${authToken}`)
        .send(postData)
        .expect(400);

      expect(response.body).toHaveProperty("message");
    });

    it("내용이 없으면 에러를 반환해야 함", async () => {
      const postData = {
        title: "제목만 있는 게시글",
      };

      const response = await request(app)
        .post("/api/post")
        .set("Authorization", `Bearer ${authToken}`)
        .send(postData)
        .expect(400);

      expect(response.body).toHaveProperty("message");
    });
  });

  describe("GET /post - 게시글 목록 조회", () => {
    it("인증된 사용자가 자신의 게시글 목록을 조회할 수 있어야 함", async () => {
      const response = await request(app)
        .get("/api/post")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty("message", "게시글 목록 조회 성공");
      expect(response.body).toHaveProperty("data");
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });
  });

  describe("PUT /post/:postId - 게시글 수정", () => {
    it("게시글 작성자가 자신의 게시글을 수정할 수 있어야 함", async () => {
      const updateData = {
        title: "수정된 게시글",
        content: "수정된 내용입니다.",
      };

      const response = await request(app)
        .put(`/api/post/${testPostId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty("message", "게시글 수정 성공");
      expect(response.body.data).toHaveProperty("title", updateData.title);
      expect(response.body.data).toHaveProperty("content", updateData.content);
    });

    it("다른 사용자가 게시글을 수정하려고 하면 403 에러를 반환해야 함", async () => {
      const updateData = {
        title: "해킹 시도",
        content: "해킹 내용",
      };

      const response = await request(app)
        .put(`/api/post/${testPostId}`)
        .set("Authorization", `Bearer ${otherUserToken}`)
        .send(updateData)
        .expect(403);

      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toContain("작성자만");
    });

    it("존재하지 않는 게시글을 수정하려고 하면 404 에러를 반환해야 함", async () => {
      const updateData = {
        title: "존재하지 않는 게시글",
        content: "내용",
      };

      const response = await request(app)
        .put("/api/post/99999")
        .set("Authorization", `Bearer ${authToken}`)
        .send(updateData)
        .expect(404);

      expect(response.body).toHaveProperty("message");
    });
  });

  describe("DELETE /post/:postId - 게시글 삭제", () => {
    let deleteTestPostId: number;

    beforeEach(async () => {
      // 삭제 테스트용 게시글 생성
      const post = await prisma.post.create({
        data: {
          title: "삭제 테스트 게시글",
          content: "삭제될 게시글",
          userId,
        },
      });
      deleteTestPostId = post.id;
    });

    it("게시글 작성자가 자신의 게시글을 삭제할 수 있어야 함", async () => {
      const response = await request(app)
        .delete(`/api/post/${deleteTestPostId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty("message", "게시글 삭제 성공");
      expect(response.body.data).toHaveProperty("id", deleteTestPostId);

      // 삭제 확인
      const deletedPost = await prisma.post.findUnique({
        where: { id: deleteTestPostId },
      });
      expect(deletedPost).toBeNull();
    });

    it("다른 사용자가 게시글을 삭제하려고 하면 403 에러를 반환해야 함", async () => {
      // 삭제 테스트용 게시글 생성
      const post = await prisma.post.create({
        data: {
          title: "다른 사용자 게시글",
          content: "내용",
          userId,
        },
      });

      const response = await request(app)
        .delete(`/api/post/${post.id}`)
        .set("Authorization", `Bearer ${otherUserToken}`)
        .expect(403);

      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toContain("작성자만");

      // 정리
      await prisma.post.delete({ where: { id: post.id } });
    });

    it("존재하지 않는 게시글을 삭제하려고 하면 404 에러를 반환해야 함", async () => {
      const response = await request(app)
        .delete("/api/post/99999")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(404);

      expect(response.body).toHaveProperty("message");
    });
  });
});

