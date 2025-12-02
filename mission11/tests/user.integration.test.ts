import request from "supertest";
import { app, server } from "../src/app";
import { UserRepository } from "../src/repositories/userRepository";
import bcrypt from "bcrypt";

describe("User API Integration Test", () => {
  let accessToken: string;
  let testEmail: string;
  let testPassword = "123456";
  let userId: number;

  beforeAll(async () => {
    if (!server.listening) {
      await new Promise<void>((resolve) => server.listen(0, resolve));
    }

    const userRepo = new UserRepository();
    testEmail = `user_${Date.now()}_${Math.floor(Math.random() * 10000)}@test.com`;
    const hashed = await bcrypt.hash(testPassword, 10);

    const user = await userRepo.createUser(testEmail, "tester", hashed);
    userId = user.id;
  });

  afterAll(async () => {
    const userRepo = new UserRepository();
    if (userId) await userRepo.deleteUser(userId);

    await new Promise<void>((resolve, reject) =>
      server.close((err) => (err ? reject(err) : resolve()))
    );
  });

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
    await request(app)
      .post("/users/login")
      .send({ email: testEmail, password: "wrong" })
      .expect(401);
  });
});
