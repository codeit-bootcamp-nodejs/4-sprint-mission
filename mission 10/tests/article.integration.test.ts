import request from "supertest";
import { app, server } from "../src/app";
import { loginAndGetToken } from "./helpers/auth";
import { ArticleRepository } from "../src/repositories/articleRepository";

describe("Article API Integration Test", () => {
  let accessToken: string;
  let articleId: number;
  let userId: number;

  beforeAll(async () => {
    const tokens = await loginAndGetToken();
    accessToken = tokens.accessToken;
    userId = tokens.userId;


    if (!server.listening) {
      await new Promise<void>((resolve) => server.listen(0, resolve));
    }

    const articleRepo = new ArticleRepository();
    const article = await articleRepo.createArticle({
      userId,
      title: "테스트 게시글",
      content: "테스트용 내용",
    });
    articleId = article.id;
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
  });

  describe("Public Article API", () => {
    it("게시글 목록 조회", async () => {
      const res = await request(app).get("/articles").expect(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("게시글 상세 조회", async () => {
      const res = await request(app).get(`/articles/${articleId}`).expect(200);

      expect(res.body).toHaveProperty("id", articleId);
      expect(res.body).toHaveProperty("title", "테스트 게시글");
    });
  });

  describe("Private Article API", () => {
    it("게시글 수정", async () => {
      const res = await request(app)
        .patch(`/articles/${articleId}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send({ title: "수정된 제목" })
        .expect(200);

      expect(res.body).toHaveProperty("title", "수정된 제목");
    });

    it("게시글 삭제", async () => {
      await request(app)
        .delete(`/articles/${articleId}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(204);

      await request(app).get(`/articles/${articleId}`).expect(404);
    });
  });
});
