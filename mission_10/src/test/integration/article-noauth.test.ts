import request from "supertest";
import { httpServer as app } from "../../app.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
let articleId: number;
let userId: number;

const mockUser = {
  email: "article-noauth-user@test.com",
  nickname: "test-noauth",
  password: "password123",
};

beforeAll(async () => {
  const existingUser = await prisma.user.findUnique({
    where: { email: mockUser.email },
  });
  if (existingUser) {
    await prisma.user.delete({ where: { id: existingUser.id } });
  }

  // Create user
  const userResponse = await request(app).post("/users").send(mockUser);
  userId = userResponse.body.userId;

  // Create article
  const article = await prisma.article.create({
    data: {
      title: "Test Article",
      content: "Test Content",
      userId: userId,
    },
  });
  articleId = article.id;
});

afterAll(async () => {
  // Clean up
  await prisma.user.delete({ where: { id: userId } });
});

describe("Article Integration Test (No Auth)", () => {
  describe("GET /articles", () => {
    it("should return a list of articles", async () => {
      const response = await request(app).get("/articles").expect(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("GET /articles/:id", () => {
    it("should return a specific article by ID", async () => {
      const response = await request(app)
        .get(`/articles/${articleId}`)
        .expect(200);

      expect(response.body).toEqual(expect.objectContaining({ id: articleId }));
    });

    it("should return 404 for non-existing article", async () => {
      const nonExistingId = 9999;
      await request(app).get(`/articles/${nonExistingId}`).expect(404);
    });
  });

  describe("GET /articles/:id/comments", () => {
    it("should return comments for a specific article", async () => {
      const response = await request(app)
        .get(`/articles/${articleId}/comments`)
        .expect(200);
      expect(Array.isArray(response.body.comments)).toBe(true);
    });

    it("should return 404 for comments of non-existing article", async () => {
      const nonExistingId = 9999;
      await request(app).get(`/articles/${nonExistingId}/comments`).expect(404);
    });
  });
});
