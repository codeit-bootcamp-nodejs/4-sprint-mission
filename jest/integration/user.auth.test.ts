import request from "supertest";
import { app } from "../../app.js";
import prisma from "../../prisma/prisma.js";
import bcrypt from "bcrypt";

describe("사용자 인증 API 통합 테스트", () => {
  // 테스트 전후 DB 정리
  beforeEach(async () => {
    // 테스트용 사용자 삭제
    await prisma.user.deleteMany({
      where: {
        email: {
          in: ["test@example.com", "test2@example.com"],
        },
      },
    });
  });

  afterEach(async () => {
    // 테스트 후 정리
    await prisma.user.deleteMany({
      where: {
        email: {
          in: ["test@example.com", "test2@example.com"],
        },
      },
    });
  });

  describe("POST /user/sign - 회원가입", () => {
    it("유효한 데이터로 회원가입 시 201 상태와 사용자 정보를 반환해야 함", async () => {
      const userData = {
        email: "test@example.com",
        nickname: "testuser",
        password: "password123",
      };

      const response = await request(app)
        .post("/user/sign")
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty("message", "회원가입 성공");
      expect(response.body.user).toHaveProperty("id");
      expect(response.body.user).toHaveProperty("email", userData.email);
      expect(response.body.user).toHaveProperty("nickname", userData.nickname);
      expect(response.body.user).not.toHaveProperty("password");
    });

    it("이메일이 중복되면 409 에러를 반환해야 함", async () => {
      // 첫 번째 사용자 생성
      await prisma.user.create({
        data: {
          email: "test@example.com",
          nickname: "user1",
          password: await bcrypt.hash("password123", 10),
        },
      });

      // 동일한 이메일로 회원가입 시도
      const response = await request(app)
        .post("/user/sign")
        .send({
          email: "test@example.com",
          nickname: "user2",
          password: "password123",
        })
        .expect(409);

      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toContain("이미 존재");
    });

    it("닉네임이 중복되면 409 에러를 반환해야 함", async () => {
      // 첫 번째 사용자 생성
      await prisma.user.create({
        data: {
          email: "test1@example.com",
          nickname: "testuser",
          password: await bcrypt.hash("password123", 10),
        },
      });

      // 동일한 닉네임으로 회원가입 시도
      const response = await request(app)
        .post("/user/sign")
        .send({
          email: "test2@example.com",
          nickname: "testuser",
          password: "password123",
        })
        .expect(409);

      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toContain("이미 존재");
    });

    it("필수 필드가 누락되면 에러를 반환해야 함", async () => {
      const response = await request(app)
        .post("/user/sign")
        .send({
          email: "test@example.com",
          // nickname과 password 누락
        })
        .expect(400);

      expect(response.body).toHaveProperty("message");
    });
  });

  describe("POST /user/login - 로그인", () => {
    beforeEach(async () => {
      // 테스트용 사용자 생성
      await prisma.user.create({
        data: {
          email: "test@example.com",
          nickname: "testuser",
          password: await bcrypt.hash("password123", 10),
        },
      });
    });

    it("유효한 이메일과 비밀번호로 로그인 시 토큰을 반환해야 함", async () => {
      const response = await request(app)
        .post("/user/login")
        .send({
          email: "test@example.com",
          password: "password123",
        })
        .expect(200);

      expect(response.body).toHaveProperty("message", "로그인 성공");
      expect(response.body).toHaveProperty("user");
      expect(response.body).toHaveProperty("accessToken");
      expect(response.body).toHaveProperty("refreshToken");
      expect(typeof response.body.accessToken).toBe("string");
      expect(typeof response.body.refreshToken).toBe("string");
    });

    it("잘못된 이메일로 로그인 시 에러를 반환해야 함", async () => {
      const response = await request(app)
        .post("/user/login")
        .send({
          email: "wrong@example.com",
          password: "password123",
        })
        .expect(401);

      expect(response.body).toHaveProperty("message");
    });

    it("잘못된 비밀번호로 로그인 시 에러를 반환해야 함", async () => {
      const response = await request(app)
        .post("/user/login")
        .send({
          email: "test@example.com",
          password: "wrongpassword",
        })
        .expect(401);

      expect(response.body).toHaveProperty("message");
    });

    it("이메일이 누락되면 에러를 반환해야 함", async () => {
      const response = await request(app)
        .post("/user/login")
        .send({
          password: "password123",
        })
        .expect(400);

      expect(response.body).toHaveProperty("message");
    });
  });

  describe("POST /user/refresh - 토큰 재발급", () => {
    let refreshToken: string;

    beforeEach(async () => {
      // 사용자 생성 및 로그인
      await prisma.user.create({
        data: {
          email: "test@example.com",
          nickname: "testuser",
          password: await bcrypt.hash("password123", 10),
        },
      });

      const loginResponse = await request(app)
        .post("/user/login")
        .send({
          email: "test@example.com",
          password: "password123",
        });

      refreshToken = loginResponse.body.refreshToken;
    });

    it("유효한 refresh token으로 새 access token을 발급받아야 함", async () => {
      const response = await request(app)
        .post("/user/refresh")
        .send({
          refreshToken,
        })
        .expect(200);

      expect(response.body).toHaveProperty("message", "토큰 재발급 성공");
      expect(response.body).toHaveProperty("accesToken");
      expect(typeof response.body.accesToken).toBe("string");
    });

    it("잘못된 refresh token으로 요청 시 에러를 반환해야 함", async () => {
      const response = await request(app)
        .post("/user/refresh")
        .send({
          refreshToken: "invalid-refresh-token",
        })
        .expect(401);

      expect(response.body).toHaveProperty("message");
    });
  });
});

