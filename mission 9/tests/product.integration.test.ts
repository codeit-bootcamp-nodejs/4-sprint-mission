// tests/product.integration.test.ts
import request from "supertest";
import { app } from "../src/app";
import { loginAndGetToken } from "./helpers/auth";

describe("상품 API 통합 테스트", () => {
  let accessToken: string;

  beforeAll(async () => {
    // 테스트용 계정 로그인 및 토큰 발급
    const tokens = await loginAndGetToken();
    accessToken = tokens.accessToken;
  });

  it("인증 필요 상품 생성", async () => {
    const res = await request(app)
      .post("/products") // 실제 라우트 확인 필요
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "테스트상품",
        price: 1000,
        description: "테스트용 상품입니다", // 10자 이상 필수
        tags: "테스트",
      })
      .expect(201); // 성공 예상

    expect(res.body).toHaveProperty("id");
    expect(res.body.name).toBe("테스트상품");
    expect(res.body.price).toBe(1000);
    expect(res.body.description).toBe("테스트용 상품입니다");
  });

  it("인증 필요 상품 조회", async () => {
    const res = await request(app)
      .get("/products")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty("name");
    expect(res.body[0]).toHaveProperty("price");
    expect(res.body[0]).toHaveProperty("description");
  });
});
