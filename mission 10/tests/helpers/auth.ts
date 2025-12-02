import request from "supertest";
import { app } from "../../src/app";
import bcrypt from "bcrypt";
import { UserRepository } from "../../src/repositories/userRepository";

interface TokenResponse {
  accessToken: string;
  refreshToken?: string;
}

export async function loginAndGetToken(
  email?: string,
  password = "123456"
): Promise<{ accessToken: string; refreshToken?: string; userId: number }> {
  const userRepo = new UserRepository();

  email = email ?? `test${Date.now()}@test.com`;

  let existing = await userRepo.findByEmail(email);

  if (!existing) {
    const hashed = await bcrypt.hash(password, 10);
    existing = await userRepo.createUser(email, "tester", hashed);
  }

  const res = await request(app)
    .post("/users/login")
    .send({ email, password })
    .expect(200);

  console.log("Login response body:", res.body);

  const { accessToken, refreshToken } = res.body;
  if (!accessToken) {
    throw new Error("로그인 실패: accessToken이 반환되지 않았습니다.");
  }

  return { accessToken, refreshToken, userId: existing.id };
}
