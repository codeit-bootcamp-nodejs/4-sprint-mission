import request from "supertest";
import server from "../app.js";
import { Server } from "http";

let testServer: Server;

// 테스트가 시작되기 전에 서버를 시작
beforeAll(() => {
  testServer = server;
});

// 모든 테스트가 끝난 후에 서버를 종료
afterAll((done) => {
  testServer.close(done);
});

describe("게시글 API 통합 테스트 (인증 불필요)", () => {
  /**
   * GET /articles
   * 게시글 목록 조회 (공개)
   * (seed.js에서 article1을 생성했으므로 데이터가 1개 이상 있어야 함)
   */
  describe("GET /articles", () => {
    it("200 OK: 게시글 목록을 성공적으로 조회해야 함", async () => {
      const res = await request(testServer).get("/articles");

      expect(res.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array); // 데이터는 배열이어야 함
      expect(res.body.data.length).toBeGreaterThan(0); // 시드 데이터가 있으므로 0보다 커야 함

      // 'Node.js와 Prisma로 만드는 효율적인 백엔드' 게시글이 포함되어 있는지 확인
      const expectedArticleTitle = "Node.js와 Prisma로 만드는 효율적인 백엔드";
      const articleTitles = res.body.data.map((a: any) => a.title);
      expect(articleTitles).toContain(expectedArticleTitle);
    });
  });

  /**
   * GET /articles/:id
   * 게시글 상세 조회 (공개)
   * (seed.js에서 article1을 생성했으므로 ID 1번을 조회)
   */
  describe("GET /articles/:id", () => {
    it("200 OK: 특정 ID(1)의 게시글을 성공적으로 조회해야 함", async () => {
      const articleId = 1; // seed.js에서 생성된 article1의 ID
      const expectedArticleTitle = "Node.js와 Prisma로 만드는 효율적인 백엔드";

      const res = await request(testServer).get(`/articles/${articleId}`);

      expect(res.status).toBe(200);
      expect(res.body.title).toBe(expectedArticleTitle);
    });

    it("400 Bad Request: ID 형식이 유효하지 않으면 400 에러를 반환해야 함", async () => {
      const invalidId = "xyz"; // validationMiddleware가 처리

      const res = await request(testServer).get(`/articles/${invalidId}`);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("유효하지 않은 ID 형식입니다.");
    });
  });
});
