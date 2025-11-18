import request from "supertest";
import app from "../src/app";

describe("인증이 필요없는 상품 API 테스트", () => {
  test("GET /product -> 실패 401 에러", async () => {
    const response = await request(app).get("/product");
    expect(response.status).toBe(401);
  });
  test("GET /product/:id -> 실패 401 에러", async () => {
    const response = await request(app).get("/product/1");
    expect(response.status).toBe(401);
  });
  test("POST /product -> 실패 401 에러", async () => {
    const response = await request(app).post("/product").send({
      name: "product1",
      description: "description1",
      price: 1000,
    });
    expect(response.status).toBe(401);
  });
  test("PATCH /product/:id -> 실패 401 에러", async () => {
    const response = await request(app).patch("/product/1").send({
      name: "product11",
    });
    expect(response.status).toBe(401);
  });
  test("DELETE /product/:id -> 실패 401 에러", async () => {
    const response = await request(app).delete("/product/1");
    expect(response.status).toBe(401);
  });
});

describe("인증이 필요한 상품 API 테스트", () => {
  const agent = request.agent(app);
  let productId: number;

  beforeAll(async () => {
    await agent.post("/user/register").send({
      email: "test1@naver.com",
      nickname: "test1",
      password: "password1",
    });

    const response = await agent.post("/user/login").send({
      email: "test1@naver.com",
      password: "password1",
    });
  });

  test("GET /product -> 성공", async () => {
    const response = await agent.get("/product");
    expect(response.status).toBe(200);
  });

  test("POST /product -> 성공", async () => {
    const response = await agent.post("/product").send({
      name: "product1",
      description: "description1",
      price: 1000,
      tags: ["test1"],
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    productId = response.body.id;
  });

  test("GET /product/:id -> 성공", async () => {
    const response = await agent.get(`/product/${productId}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(productId);
    expect(response.body.name).toBe("product1");
  });

  test("PATCH /product/:id -> 성공", async () => {
    const response = await agent.patch(`/product/${productId}`).send({
      name: "product11",
    });
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(productId);
    expect(response.body.name).toBe("product11");
  });

  test("DELETE /product/:id -> 성공", async () => {
    const response = await agent.delete(`/product/${productId}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("상품이 삭제되었습니다.");
  });

  test("GET /product/:id -> 실패 404 에러", async () => {
    const response = await agent.get(`/product/${productId}`);
    expect(response.status).toBe(404);
  });
});
