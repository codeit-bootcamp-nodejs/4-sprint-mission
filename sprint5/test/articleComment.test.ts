import request from "supertest";
import app from "../app";
import prisma from "../lib/prisma";
import bcrypt from "bcrypt";

describe("Article Comment API 통합 테스트 (JWT 기반)", () => {
  const testUser = {
    email: "test@example.com",
    nickname: "testuser",
    password: "password1",
  };

  const testUser2 = {
    email: "test2@example.com",
    nickname: "testuser2",
    password: "password2",
  };

  let articleId: number;
  let commentId: number;
  let commentId2: number;
  let cookie: string;
  let user2Cookie: string;
  let testUserId: number;

  const ACCESS_TOKEN_COOKIE_NAME = "access-token";

  beforeAll(async () => {
    // 테스트 유저1 등록
    const hashedPassword = await bcrypt.hash(testUser.password, 10);
    const user = await prisma.user.upsert({
      where: { email: testUser.email },
      update: {},
      create: {
        email: testUser.email,
        nickname: testUser.nickname,
        password: hashedPassword,
      },
    });
    testUserId = user.id;

    const loginRes = await request(app)
      .post("/auth/login")
      .send({ email: testUser.email, password: testUser.password })
      .expect(200);

    cookie = `${ACCESS_TOKEN_COOKIE_NAME}=${loginRes.body.token}; Path=/`;

    // 테스트 유저2 등록
    const user2HashedPassword = await bcrypt.hash(testUser2.password, 10);
    await prisma.user.upsert({
      where: { email: testUser2.email },
      update: {},
      create: {
        email: testUser2.email,
        nickname: testUser2.nickname,
        password: user2HashedPassword,
      },
    });

    const user2LoginRes = await request(app)
      .post("/auth/login")
      .send({ email: testUser2.email, password: testUser2.password })
      .expect(200);

    user2Cookie = `${ACCESS_TOKEN_COOKIE_NAME}=${user2LoginRes.body.token}; Path=/`;

    // 3. 테스트에 필요한 게시글 생성
    const article = await prisma.article.create({
      data: {
        title: "테스트 게시글",
        content: "댓글을 달 게시글입니다.",
        userId: testUserId,
      },
    });
    articleId = article.id;
  });

  afterAll(async () => {
    // 1. 댓글 삭제
    if (commentId) {
      await prisma.comment.deleteMany({ where: { id: commentId } });
    }
    if (commentId2) {
      await prisma.comment.deleteMany({ where: { id: commentId2 } });
    }

    // 2. 게시글 삭제
    await prisma.article.deleteMany({ where: { id: articleId } });

    // 3. 유저 삭제
    await prisma.user.deleteMany({
      where: {
        email: {
          in: [testUser.email, testUser2.email],
        },
      },
    });

    await prisma.$disconnect();
  });

  describe("POST /articles/:articleId/comments", () => {
    it("인증없이 댓글 등록 시 401 Unauthorized 반환", async () => {
      await request(app)
        .post(`/articles/${articleId}/comments`)
        .send({ content: "인증 없는 댓글" })
        .expect(401);
    });

    it("존재하지 않는 게시글에 댓글 등록 시 404 Not Found 반환", async () => {
      const nonExistentArticleId = 9999;
      await request(app)
        .post(`/articles/${nonExistentArticleId}/comments`)
        .set("Cookie", cookie)
        .send({ content: "댓글 내용" })
        .expect(404);
    });

    it("댓글 생성 성공 시 201 Created 반환 및 commentId 저장", async () => {
      const res = await request(app)
        .post(`/articles/${articleId}/comments`)
        .set("Cookie", cookie)
        .send({ content: "첫 번째 댓글 내용" })
        .expect(201);

      expect(res.body).toHaveProperty("id");
      expect(res.body.content).toBe("첫 번째 댓글 내용");
      expect(res.body.articleId).toBe(articleId);

      commentId = res.body.id; // 이후 테스트에 사용
    });
  });

  describe("GET /articles/:articleId/comments", () => {
    beforeAll(async () => {
      // 페이지네이션 테스트를 위해 두 번째 댓글 추가 (ID가 commentId2에 저장됨)
      const res = await request(app)
        .post(`/articles/${articleId}/comments`)
        .set("Cookie", cookie)
        .send({ content: "두 번째 댓글 내용" })
        .expect(201);

      commentId2 = res.body.id;
    });

    it("댓글 목록 조회 성공 시 200 OK 및 배열 반환", async () => {
      const res = await request(app)
        .get(`/articles/${articleId}/comments`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(2);
      // 가장 최근 댓글이 먼저 오도록 (orderBy: desc) 가정하고 검증
      expect(res.body[0].id).toBe(commentId2);
      expect(res.body[1].id).toBe(commentId);
    });

    it("limit=1 페이지네이션 테스트 (최신 댓글 1개만 조회)", async () => {
      const res = await request(app)
        .get(`/articles/${articleId}/comments?limit=1`)
        .expect(200);

      expect(res.body.length).toBe(1);
      expect(res.body[0].id).toBe(commentId2);
    });

    it("선택한 범위에 댓글이 없을 경우 404 Not Found 반환", async () => {
      const tooSmallCursor = 1;

      await request(app)
        .get(`/articles/${articleId}/comments?cursor=${tooSmallCursor}&limit=1`)
        .expect(404);
    });
  });

  describe("PATCH /articles/:articleId/comments/:commentId", () => {
    it("인증없이 댓글 수정 시 401 Unauthorized 반환", async () => {
      await request(app)
        .patch(`/articles/${articleId}/comments/${commentId}`)
        .send({ content: "수정 시도" })
        .expect(401);
    });

    it("다른 유저의 댓글 수정 시 403 Forbidden 반환", async () => {
      await request(app)
        .patch(`/articles/${articleId}/comments/${commentId}`)
        .set("Cookie", user2Cookie)
        .send({ content: "권한 없는 수정" })
        .expect(403);
    });

    it("존재하지 않는 댓글 수정 시 404 Not Found 반환", async () => {
      const nonExistentCommentId = 9999;
      await request(app)
        .patch(`/articles/${articleId}/comments/${nonExistentCommentId}`)
        .set("Cookie", cookie)
        .send({ content: "404 테스트" })
        .expect(404);
    });

    it("댓글 수정 성공 시 200 OK 및 수정 내용 반환", async () => {
      const updatedContent = "수정된 댓글 내용입니다.";
      const res = await request(app)
        .patch(`/articles/${articleId}/comments/${commentId}`)
        .set("Cookie", cookie)
        .send({ content: updatedContent })
        .expect(200);

      expect(res.body.id).toBe(commentId);
      expect(res.body.content).toBe(updatedContent);
    });
  });

  describe("DELETE /articles/:articleId/comments/:commentId", () => {
    it("인증없이 댓글 삭제 시 401 Unauthorized 반환", async () => {
      await request(app)
        .delete(`/articles/${articleId}/comments/${commentId}`)
        .expect(401);
    });

    it("다른 유저의 댓글 삭제 시 403 Forbidden 반환", async () => {
      // commentId2는 testUser1이 작성했으므로, user2는 삭제 권한이 없음
      await request(app)
        .delete(`/articles/${articleId}/comments/${commentId2}`)
        .set("Cookie", user2Cookie)
        .expect(403);
    });

    it("존재하지 않는 댓글 삭제 시 404 Not Found 반환", async () => {
      const nonExistentCommentId = 9999;
      await request(app)
        .delete(`/articles/${articleId}/comments/${nonExistentCommentId}`)
        .set("Cookie", cookie)
        .expect(404);
    });

    it("댓글 삭제 성공 시 200 OK 반환", async () => {
      // commentId (첫 번째 댓글) 삭제
      await request(app)
        .delete(`/articles/${articleId}/comments/${commentId}`)
        .set("Cookie", cookie)
        .expect(200);
    });
  });
});
