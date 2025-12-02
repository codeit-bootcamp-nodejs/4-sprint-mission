import request from "supertest";
import { app, server } from "../src/app";
import { ArticleRepository } from "../src/repositories/articleRepository";
import { UserRepository } from "../src/repositories/userRepository";
import bcrypt from "bcrypt";

describe("Article API Integration Test", () => {
  let accessToken: string;
  let userId: number;
  let articleId: number;

  beforeAll(async () => {
    if (!server.listening) {
      await new Promise<void>((resolve) => server.listen(0, resolve));
    }

    const userRepo = new UserRepository();
    const testEmail = `test_${Date.now()}@example.com`;

    const hashedPassword = await bcrypt.hash("test1234", 10);

    const user = await userRepo.createUser(
      testEmail,
      "테스트유저",
      hashedPassword
    );

    userId = user.id;

    // 2. 로그인 후 accessToken 획득
    const loginRes = await request(app)
      .post("/users/login")
      .send({
        email: testEmail,
        password: "test1234",
      })
      .expect(200);

    accessToken = loginRes.body.accessToken;

    // 3. 게시글 생성
    const articleRepo = new ArticleRepository();
    const article = await articleRepo.createArticle({
      userId,
      title: "테스트 게시글",
      content: "테스트 내용",
    });

    articleId = article.id;
  });

  afterAll(async () => {
    const userRepo = new UserRepository();

    // 생성된 유저 삭제
    if (userId) {
      await userRepo.deleteUser(userId);
    }

    // 서버 종료
    await new Promise<void>((resolve, reject) =>
      server.close((err) => (err ? reject(err) : resolve()))
    );
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
