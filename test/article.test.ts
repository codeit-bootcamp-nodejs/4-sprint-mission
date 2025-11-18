import request from "supertest";
import app from "../src/app";

describe("인증이 필요없는 게시글 API 테스트", () => {
  test("GET /article -> 실패 401 에러", async () => {
    const response = await request(app).get("/article");
    expect(response.status).toBe(401);
  });
  test("GET /article/:id -> 실패 401 에러", async () => {
    const response = await request(app).get("/article/1");
    expect(response.status).toBe(401);
  });
  test("POST /article -> 실패 401 에러", async () => {
    const response = await request(app).post("/article").send({
      title: "article1",
      content: "content1",
    });
    expect(response.status).toBe(401);
  });
  test("PATCH /article/:id -> 실패 401 에러", async () => {
    const response = await request(app).patch("/article/1").send({
      title: "article11",
    });
    expect(response.status).toBe(401);
  });
  test("DELETE /article/:id -> 실패 401 에러", async () => {
    const response = await request(app).delete("/article/1");
    expect(response.status).toBe(401);
  });
});

describe("인증이 필요한 게시글 API 테스트", () => {
  const agent = request.agent(app);
  let articleId: number;

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

  test("GET /article -> 성공", async () => {
    const response = await agent.get("/article");
    expect(response.status).toBe(200);
  });

  test("POST /article -> 성공", async () => {
    const response = await agent.post("/article").send({
      title: "article1",
      content: "content1",
    });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    articleId = response.body.id;
  });

  test("PATCH /article/:id -> 성공", async () => {
    const response = await agent.patch(`/article/${articleId}`).send({
      title: "article11",
    });
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(articleId);
    expect(response.body.title).toBe("article11");
  });

  test("DELETE /article/:id -> 성공", async () => {
    const response = await agent.delete(`/article/${articleId}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("게시글이 삭제되었습니다.");
  });

  test("GET /article/:id -> 실패 404 에러", async () => {
    const response = await agent.get(`/article/${articleId}`);
    expect(response.status).toBe(404);
  });
});
