import request from "supertest";
import { app } from "../../app.js";

describe("게시글 API - 인증 테스트", () => {
  describe("GET /api/post - 게시글 목록 조회 (인증 불필요)", () => {
    it("토큰 없이도 게시글 목록을 조회할 수 있어야 함", async () => {
      const response = await request(app)
        .get("/api/post");

      // 게시글이 있으면 200, 없으면 404 (비즈니스 로직)
      expect([200, 404]).toContain(response.status);
    });
  });

  describe("POST /api/post - 게시글 작성 (인증 필요)", () => {
    it("토큰 없이 게시글 작성 시 401 에러를 반환해야 함", async () => {
      const postData = {
        title: "테스트 게시글",
        content: "테스트 내용",
      };

      const response = await request(app)
        .post("/api/post")
        .send(postData)
        .expect(401);

      expect(response.body).toHaveProperty("message");
    });
  });

  describe("PUT /api/post/:postId - 게시글 수정 (인증 필요)", () => {
    it("토큰 없이 게시글 수정 시 401 에러를 반환해야 함", async () => {
      const postData = {
        title: "수정된 게시글",
        content: "수정된 내용",
      };

      const response = await request(app)
        .put("/api/post/1")
        .send(postData)
        .expect(401);

      expect(response.body).toHaveProperty("message");
    });
  });

  describe("DELETE /api/post/:postId - 게시글 삭제 (인증 필요)", () => {
    it("토큰 없이 게시글 삭제 시 401 에러를 반환해야 함", async () => {
      const response = await request(app)
        .delete("/api/post/1")
        .expect(401);

      expect(response.body).toHaveProperty("message");
    });
  });
});
