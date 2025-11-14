// import bcrypt from "bcrypt";
import { UserService } from "../src/services/userService";
import { UserRepository } from "../src/repositories/userRepository";
import { generateTokens } from "../src/lib/token";

jest.mock("../src/repositories/userRepository");
jest.mock("../src/lib/token");

describe("UserService", () => {
  let service: UserService;
  let userRepo: jest.Mocked<UserRepository>;

  beforeEach(() => {
    service = new UserService();
    userRepo = service["userRepo"] as any;
  });

  it("회원가입 성공", async () => {
    userRepo.findByEmail.mockResolvedValue(null);
    userRepo.createUser.mockResolvedValue({
      id: 1,
      email: "test@test.com",
      nickname: "tester",
      password: "hashed_password",
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const res = await service.register({
      email: "a@test.com",
      password: "123",
      nickname: "nick",
    });
    expect(res).toHaveProperty("message");
    expect(userRepo.createUser).toHaveBeenCalled();
  });

  it("회원가입 중복 이메일", async () => {
    userRepo.findByEmail.mockResolvedValue({
      id: 1,
      email: "a@test.com",
      nickname: "tester",
      password: "hashed",
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await expect(
      service.register({
        email: "a@test.com",
        password: "123",
        nickname: "nick",
      })
    ).rejects.toThrow("EMAIL_EXISTS");
  });

  it("JWT 토큰 생성", () => {
    (generateTokens as jest.Mock).mockReturnValue({
      accessToken: "token",
      refreshToken: "refresh",
    });
    const tokens = service.generateUserTokens(1);
    expect(tokens).toHaveProperty("accessToken");
  });
});
