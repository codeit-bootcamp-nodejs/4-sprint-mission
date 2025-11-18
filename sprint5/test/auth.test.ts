import request from "supertest";
import app from "../app";
import prisma from "../lib/prisma";

describe("Auth API 통합 테스트", () => {
  const testUser = {
    email: "test@example.com",
    nickname: "testuser",
    password: "passowrd1",
  };

  afterAll(async () => {
    // 테스트 후 DB 정리
    await prisma.user.deleteMany({ where: { email: testUser.email } });
    await prisma.$disconnect();
  });

  describe("POST /auth/register", () => {
    it("새로운 유저 등록", async () => {
      const res = await request(app)
        .post("/auth/register")
        .send(testUser)
        .expect(201);

      expect(res.body).toHaveProperty("id");
      expect(res.body).toHaveProperty("email", testUser.email);
      expect(res.body).not.toHaveProperty("password");
    });

    it("이미 등록된 이메일일 경우 409 반환", async () => {
      const res = await request(app)
        .post("/auth/register")
        .send(testUser)
        .expect(409);

      expect(res.body).toHaveProperty("message");
    });
  });

  describe("POST /auth/login", () => {
    it("로그인 성공 및 토큰 반환", async () => {
      const res = await request(app)
        .post("/auth/login")
        .send({ email: testUser.email, password: testUser.password })
        .expect(200);

      expect(res.body).toHaveProperty("token");
      expect(res.headers["set-cookie"]).toBeDefined();
    });

    it("잘못된 로그인 시 401 반환", async () => {
      const res = await request(app)
        .post("/auth/login")
        .send({ email: testUser.email, password: "wrongpass" })
        .expect(401);

      expect(res.body).toHaveProperty("error");
    });
  });

  describe("POST /auth/refresh", () => {
    it("토큰 리프레시 성공", async () => {
      // 로그인 먼저
      const loginRes = await request(app)
        .post("/auth/login")
        .send({ email: testUser.email, password: testUser.password });

      const cookies = loginRes.headers["set-cookie"];
      if (!cookies) throw new Error("쿠키가 없습니다.");

      const res = await request(app)
        .post("/auth/refresh")
        .set("Cookie", cookies) // 이제 cookies는 string[] 타입으로 안전
        .expect(200);

      expect(res.body).toHaveProperty("token");
    });
  });

  describe("POST /auth/logout", () => {
    it("쿠키 삭제 후 로그아웃 성공", async () => {
      const res = await request(app).post("/auth/logout").expect(200);

      expect(res.body).toHaveProperty("success", true);
    });
  });
});
