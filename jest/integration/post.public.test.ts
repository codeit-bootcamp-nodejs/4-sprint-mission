import request from "supertest";
import { app } from "../../app.js";

describe("게시글 API - 인증 불필요 테스트 (인증 실패 케이스)", () => {
  describe("GET /post - 게시글 목록 조회 (인증 필요)", () => {
    it("토큰 없이 요청 시 401 에러를 반환해야 함", async () => {
      const response = await request(app)
        .get("/post")
        .expect(401);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body.message).toContain("토큰");
    });

    it("잘못된 토큰으로 요청 시 401 에러를 반환해야 함", async () => {
      const response = await request(app)
        .get("/post")
        .set("Authorization", "Bearer invalid-token")
        .expect(401);

      expect(response.body).toHaveProperty("success", false);
    });
  });

  describe("POST /post - 게시글 작성 (인증 필요)", () => {
    it("토큰 없이 게시글 작성 시 401 에러를 반환해야 함", async () => {
      const postData = {
        title: "테스트 게시글",
        content: "테스트 내용",
      };

      const response = await request(app)
        .post("/post")
        .send(postData)
        .expect(401);

      expect(response.body).toHaveProperty("success", false);
    });
  });

  describe("PUT /post/:postId - 게시글 수정 (인증 필요)", () => {
    it("토큰 없이 게시글 수정 시 401 에러를 반환해야 함", async () => {
      const postData = {
        title: "수정된 게시글",
        content: "수정된 내용",
      };

      const response = await request(app)
        .put("/post/1")
        .send(postData)
        .expect(401);

      expect(response.body).toHaveProperty("success", false);
    });
  });

  describe("DELETE /post/:postId - 게시글 삭제 (인증 필요)", () => {
    it("토큰 없이 게시글 삭제 시 401 에러를 반환해야 함", async () => {
      const response = await request(app)
        .delete("/post/1")
        .expect(401);

      expect(response.body).toHaveProperty("success", false);
    });
  });
});

