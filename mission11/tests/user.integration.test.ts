import request from "supertest";
import { app, server } from "../src/app";
import { clearDatabase } from "./helpers/db";
import { UserRepository } from "../src/repositories/userRepository";
import bcrypt from "bcrypt";

describe("User API Integration Test", () => {
  let accessToken: string;
  let testEmail: string;
  let testPassword = "123456";
  let userId: number;

  beforeAll(async () => {
    await clearDatabase();

    if (!server.listening) {
      await new Promise<void>((resolve) => server.listen(0, resolve));
    }

    testEmail = `user_${Date.now()}@test.com`;

    const userRepo = new UserRepository();
    const hashed = await bcrypt.hash(testPassword, 10);

    const user = await userRepo.createUser(testEmail, "tester", hashed);
    userId = user.id;
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
  });

  describe("User Login", () => {
    it("로그인 성공", async () => {
      const res = await request(app)
        .post("/users/login")
        .send({ email: testEmail, password: testPassword })
        .expect(200);

      expect(res.body).toHaveProperty("accessToken");
      expect(res.body).toHaveProperty("refreshToken");
      accessToken = res.body.accessToken;
    });

    it("잘못된 비밀번호 로그인 실패", async () => {
      const res = await request(app)
        .post("/users/login")
        .send({ email: testEmail, password: "wrong" })
        .expect(401);

      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toBe("Unauthorized");
    });
  });

  describe("User Registration", () => {
    it("회원가입 성공", async () => {
      const newEmail = `reg_${Date.now()}@test.com`;
      const res = await request(app)
        .post("/users/register")
        .send({ email: newEmail, password: "123456", nickname: "tester" })
        .expect(201);

      expect(res.body).toHaveProperty("message");
    });

    it("중복 이메일 회원가입 실패", async () => {
      await request(app)
        .post("/users/register")
        .send({ email: testEmail, password: "123456", nickname: "dup" })
        .expect(409);
    });
  });
});
