// tests/helpers/auth.ts
import request from "supertest";
import { app } from "../../src/app";
import bcrypt from "bcrypt";
import { UserRepository } from "../../src/repositories/userRepository";

interface TokenResponse {
  accessToken: string;
  refreshToken?: string;
}

export async function loginAndGetToken(
  email = "test@test.com",
  password = "123456"
): Promise<TokenResponse> {
  const userRepo = new UserRepository();

  // 1️⃣ 테스트용 유저 확인
  let existing = await userRepo.findByEmail(email);

  // 2️⃣ 없으면 생성
  if (!existing) {
    const hashed = await bcrypt.hash(password, 10);
    existing = await userRepo.createUser(email, "tester", hashed);
  }

  // 3️⃣ 로그인 요청
  const res = await request(app)
    .post("/users/login")
    .send({ email, password })
    .expect(200);

  console.log("Login response body:", res.body); // 디버깅용

  // 4️⃣ 로그인 성공 시 accessToken 반환
  const { accessToken, refreshToken } = res.body;
  if (!accessToken) {
    throw new Error("로그인 실패: accessToken이 반환되지 않았습니다.");
  }

  return { accessToken, refreshToken };
}
