import request from "supertest";
import { httpServer as app } from "../../app.js";
import { PrismaClient } from "@prisma/client";
import { getAuthToken } from "../util/getAuthToken.js";

const prisma = new PrismaClient();

let authToken: string;
let userId: number;
let articleId: number;
let commentId: number;

const mockUser = {
  email: "article-auth-user@test.com",
  nickname: "test-auth",
  password: "password123",
};

const mockArticle = {
  title: "Auth Test Article",
  content: "This is the content of the auth test article.",
};

const mockComment = {
  name: "test-author",
  content: "Example auth comment",
};

beforeAll(async () => {
  // Ensure user does not exist
  const existingUser = await prisma.user.findUnique({
    where: { email: mockUser.email },
  });
  if (existingUser) {
    await prisma.user.delete({ where: { id: existingUser.id } });
  }

  await request(app).post("/users").send(mockUser);
  authToken = await getAuthToken(mockUser.email, mockUser.password);
  const user = await prisma.user.findUnique({
    where: { email: mockUser.email },
  });
  userId = user!.id;

  const articleResponse = await request(app)
    .post("/articles")
    .set("Authorization", `Bearer ${authToken}`)
    .send({ ...mockArticle, userId });
  articleId = articleResponse.body.id;

  const commentResponse = await request(app)
    .post(`/articles/${articleId}/comments`)
    .set("Authorization", `Bearer ${authToken}`)
    .send({ ...mockComment, userId });
  commentId = commentResponse.body.id;
});

afterAll(async () => {
  await prisma.user.delete({ where: { id: userId } });
  authToken = "";
});

describe("Article Integration Test (Auth)", () => {
  describe("POST /articles", () => {
    it("should create another article and return its properties", async () => {
      const anotherMockArticle = {
        title: "Another New Article",
        content: "This is another article.",
      };

      const response = await request(app)
        .post("/articles")
        .set("Authorization", `Bearer ${authToken}`)
        .send(anotherMockArticle)
        .expect(201);
      expect(response.body).toEqual(
        expect.objectContaining({ id: expect.any(Number) })
      );
      await prisma.article.delete({ where: { id: response.body.id } });
    });
  });

  describe("PATCH /articles/:id", () => {
    it("should update a specific article by ID", async () => {
      const updatedData = {
        title: "Modified Title",
      };

      const response = await request(app)
        .patch(`/articles/${articleId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(updatedData)
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({ id: articleId, title: updatedData.title })
      );
    });
  });

  describe("DELETE /articles/:id", () => {
    it("should delete a specific article by ID", async () => {
      const tempArticleRes = await request(app)
        .post("/articles")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ ...mockArticle, title: "To Be Deleted" });
      const tempArticleId = tempArticleRes.body.id;

      const response = await request(app)
        .delete(`/articles/${tempArticleId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty("id", tempArticleId);
    });
  });

  describe("POST /articles/:id/comments", () => {
    it("should post another comment to a specific article", async () => {
      const anotherMockComment = {
        name: "another-author",
        content: "Another example comment",
      };

      const response = await request(app)
        .post(`/articles/${articleId}/comments`)
        .send(anotherMockComment)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(201);

      expect(response.body).toHaveProperty("id");
      await prisma.comment.delete({ where: { id: response.body.id } });
    });
  });

  describe("PATCH /articles/:id/comments/:cid", () => {
    it("should update a specific comment by ID", async () => {
      const updatedComment = {
        name: "updated-author",
        content: "Updated comment content",
      };

      const response = await request(app)
        .patch(`/articles/${articleId}/comments/${commentId}`)
        .send(updatedComment)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty("content", updatedComment.content);
    });
  });

  describe("DELETE /articles/:id/comments/:cid", () => {
    it("should delete a specific comment by ID", async () => {
      const tempCommentRes = await request(app)
        .post(`/articles/${articleId}/comments`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ name: "temp-user", content: "to be deleted" });
      const tempCommentId = tempCommentRes.body.id;

      const response = await request(app)
        .delete(`/articles/${articleId}/comments/${tempCommentId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty("id", tempCommentId);
    });
  });
});
