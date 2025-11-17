import request from "supertest";
import prisma from "../lib/prisma";
import app from "../app";

describe("Unauthorized Article Test", () => {
  let articleId: number;

  beforeAll(async () => {
    await prisma.product.deleteMany({});
    await prisma.article.deleteMany({});
    await prisma.user.deleteMany({});

    const user = await prisma.user.create({
      data: {
        email: "test@test.com",
        nickname: "nick",
        password: "pass",
      },
    });

    const article = await prisma.article.create({
      data: {
        title: "test",
        content: "내용",
        ownerId: user.id,
      },
    });

    articleId = article.id;
  });
  test("GET /list", async () => {
    const response = await request(app).get("/articles/list").expect(200);

    expect(response.body.length).toBeGreaterThanOrEqual(1);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
});

describe("Authorized Article Test", () => {
  let tokenHeader: string;
  let articleId: number;

  beforeAll(async () => {
    await prisma.product.deleteMany({});
    await prisma.article.deleteMany({});
    await prisma.user.deleteMany({});

    const user = await prisma.user.create({
      data: {
        email: "test@test.com",
        nickname: "nick",
        password: "pass",
      },
    });

    const article = await prisma.article.create({
      data: {
        title: "testarticle",
        content: "내용",
        ownerId: user.id,
      },
    });

    articleId = article.id;

    const createUser = await request(app)
      .post("/users/register")
      .send({
        email: "test123@test.com",
        password: "password",
        nickname: "helloWorld",
      })
      .expect(201);

    const loginUser = await request(app)
      .post("/users/login")
      .send({
        email: "test123@test.com",
        password: "password",
      })
      .expect(200);

    const token = loginUser.body.data.accessHeader;
    tokenHeader = "Bearer " + token;
  });

  test("GET /detail", async () => {
    const response = await request(app)
      .get(`/articles/detail/${articleId}`)
      .set("Authorization", tokenHeader)
      .expect(200);

    expect(response.body.id).toEqual(articleId);
    expect(response.body.name).toEqual("testarticle");
    expect(response.body.price).toBeGreaterThan(0);
  });

  test("POST /article", async () => {
    const response = await request(app)
      .post("/articles")
      .send({
        title: "Test_Article",
        content: "Test_Content",
      })
      .set("Authorization", tokenHeader)
      .expect(201);
  });

  test("POST /article 코멘트", async () => {
    const response = await request(app)
      .post("/articles/comments/" + articleId)
      .send({
        content: "내용",
      })
      .set("Authorization", tokenHeader)
      .expect(201);

    expect(response.body.data.content).toEqual("내용");
  });

  test("PATCH /article", async () => {
    const response = await request(app)
      .patch("/articles/" + articleId)
      .send({
        title: "Test_Article",
        content: "Test_Content",
      })
      .set("Authorization", tokenHeader)
      .expect(200);

    expect(response.body.data.name).toEqual("Test_Article_patch");
    expect(response.body.data.description).toEqual("Test_Description_patch");
    expect(response.body.data.price).toEqual(50000);
  });

  test("PATCH /article 코멘트", async () => {
    const response = await request(app)
      .patch("/articles/comments/" + articleId)
      .send({
        content: "새 내용",
      })
      .set("Authorization", tokenHeader)
      .expect(200);

    expect(response.body.data.content).toEqual("새 내용");
  });

  test("DELETE /article", async () => {
    const response = await request(app)
      .delete("/articles/" + articleId)
      .set("Authorization", tokenHeader)
      .expect(200);
  });
});
