import prisma from "../src/repository/prisma";
import request from "supertest";
import app from "../src/app";

describe("회원 API 테스트", () => {
  const agent = request.agent(app);
  test("회원가입 성공", async () => {
    const response = await agent.post("/user/register").send({
      email: "test1@naver.com",
      nickname: "test1",
      password: "password1",
    });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.email).toBe("test1@naver.com");
  });
  test("로그인 성공", async () => {
    const response = await agent.post("/user/login").send({
      email: "test1@naver.com",
      password: "password1",
    });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("test1님, 어서오세요.");

    const cookies = response.headers["set-cookie"];
    expect(cookies).toBeDefined();
    console.log(cookies);
    expect(
      cookies.some((cookie: string) => cookie.includes("access-token="))
    ).toBe(true);
    expect(
      cookies.some((cookie: string) => cookie.includes("refresh-token="))
    ).toBe(true);

    const accessTokenCookie = cookies.find((cookie: string) =>
      cookie.includes("access-token=")
    );
    const accessToken = accessTokenCookie.split(";")[0].split("=")[1];
    expect(accessToken.split(".").length).toBe(3);
  });
});
