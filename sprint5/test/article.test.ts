import request from "supertest";
import app from "../app";
import prisma from "../lib/prisma";
import bcrypt from "bcrypt";

describe("Article API 통합 테스트 (JWT 기반)", () => {
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

  let token: string;
  let articleId: number;
  let cookie: string;
  let user2Cookie: string;

  const ACCESS_TOKEN_COOKIE_NAME = "access-token";

  beforeAll(async () => {
    // 테스트 유저1 등록
    const hashedPassword = await bcrypt.hash(testUser.password, 10);
    await prisma.user.upsert({
      where: { email: testUser.email },
      update: {},
      create: {
        email: testUser.email,
        nickname: testUser.nickname,
        password: hashedPassword,
      },
    });

    // 로그인해서 JWT 받기
    const loginRes = await request(app)
      .post("/auth/login")
      .send({ email: testUser.email, password: testUser.password })
      .expect(200);

    token = loginRes.body.token;

    // 토큰을 서버가 기대하는 쿠키 헤더 문자열로 변환
    // 서버의 JWT 인증 전략이 쿠키를 사용하므로, 테스트도 쿠키를 사용하도록 변경
    cookie = `${ACCESS_TOKEN_COOKIE_NAME}=${token}; Path=/`;

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

    const user2Token = user2LoginRes.body.token;

    user2Cookie = `${ACCESS_TOKEN_COOKIE_NAME}=${user2Token}; Path=/`;
  });

  afterAll(async () => {
    // 테스트 종료 후 데이터 제거
    await prisma.user.deleteMany({
      where: {
        email: {
          in: [testUser.email, testUser2.email],
        },
      },
    });
    await prisma.article.deleteMany({ where: { id: articleId } });
    await prisma.$disconnect();
  });

  describe("POST /articles", () => {
    it("인증없이 게시글 생성 시 401 Unauthorized 반환", async () => {
      await request(app)
        .post("/articles")
        .send({ title: "인증 없는 글", content: "인증 없는 내용" })
        .expect(401);
    });

    it("필수 항목 누락 시 400 Bad Request 반환", async () => {
      await request(app)
        .post("/articles")
        .set("Cookie", cookie)
        .send({ title: "", content: "제목 누락" })
        .expect(400);
    });

    it("게시글 생성", async () => {
      const res = await request(app)
        .post("/articles")
        .set("Cookie", cookie)
        .send({ title: "테스트 글", content: "테스트 내용" })
        .expect(201);

      expect(res.body).toHaveProperty("id");
      expect(res.body.title).toBe("테스트 글");
      expect(res.body.content).toBe("테스트 내용");

      articleId = res.body.id; // 이후 테스트에 사용
    });
  });

  describe("GET /articles", () => {
    it("게시글 목록 조회", async () => {
      const res = await request(app).get("/articles").expect(200);

      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("GET /articles/:id", () => {
    it("게시글 상세 조회", async () => {
      const res = await request(app).get(`/articles/${articleId}`).expect(200);

      expect(res.body).toHaveProperty("id", articleId);
      expect(res.body.title).toBe("테스트 글");
      expect(res.body.content).toBe("테스트 내용");
    });
  });

  describe("PATCH /articles/:id", () => {
    it("인증없이 게시글 수정 시 401 Unauthorized 반환", async () => {
      await request(app)
        .patch(`/articles/${articleId}`)
        .send({ title: "수정된 글", content: "수정된 내용" })
        .expect(401);
    });

    it("다른 유저 게시글 수정 시 403 반환", async () => {
      await request(app)
        .patch(`/articles/${articleId}`)
        .set("Cookie", user2Cookie)
        .send({ title: "수정된 글", content: "수정된 내용" })
        .expect(403);
    });

    it("게시글 수정", async () => {
      const res = await request(app)
        .patch(`/articles/${articleId}`)
        .set("Cookie", cookie)
        .send({ title: "수정된 글" })
        .expect(200);

      expect(res.body.title).toBe("수정된 글");
    });
  });

  describe("DELETE /articles/:id", () => {
    it("인증없이 게시글 삭제 시 401 Unauthorized 반환", async () => {
      await request(app).delete(`/articles/${articleId}`).expect(401);
    });

    it("다른 유저 게시글 삭제 시 403 반환", async () => {
      await request(app)
        .delete(`/articles/${articleId}`)
        .set("Cookie", user2Cookie)
        .expect(403);
    });

    it("게시글 삭제", async () => {
      await request(app)
        .delete(`/articles/${articleId}`)
        .set("Cookie", cookie)
        .expect(200);
    });
  });
});
