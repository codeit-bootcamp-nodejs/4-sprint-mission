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

describe("상품 API 통합 테스트 (인증 불필요)", () => {
  /**
   * GET /products
   * 상품 목록 조회 (공개)
   * (seed.js에서 product1을 생성했으므로 데이터가 1개 이상 있어야 함)
   */
  describe("GET /products", () => {
    it("200 OK: 상품 목록을 성공적으로 조회해야 함", async () => {
      const res = await request(testServer).get("/products");

      expect(res.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array); // 데이터는 배열이어야 함
      expect(res.body.data.length).toBeGreaterThan(0); // 시드 데이터가 있으므로 0보다 커야 함

      // '초고성능 게이밍 마우스' 상품이 포함되어 있는지 확인
      const expectedProductName = "초고성능 게이밍 마우스";
      const productNames = res.body.data.map((p: any) => p.name);
      expect(productNames).toContain(expectedProductName);
    });
  });

  /**
   * GET /products/:id
   * 상품 상세 조회 (공개)
   * (seed.js에서 product1을 생성했으므로 ID 1번을 조회)
   */
  describe("GET /products/:id", () => {
    it("200 OK: 특정 ID(1)의 상품을 성공적으로 조회해야 함", async () => {
      const productId = 1; // seed.js에서 생성된 product1의 ID
      const expectedProductName = "초고성능 게이밍 마우스";

      const res = await request(testServer).get(`/products/${productId}`);

      expect(res.status).toBe(200);
      expect(res.body.name).toBe(expectedProductName);
    });

    it("400 Bad Request: ID 형식이 유효하지 않으면 400 에러를 반환해야 함", async () => {
      const invalidId = "abc"; // validationMiddleware가 처리

      const res = await request(testServer).get(`/products/${invalidId}`);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("유효하지 않은 ID 형식입니다.");
    });

    // 현재 코드(product-service.ts, error-handler-middleware.ts)는 존재하지 않는 ID(예: 999) 조회 시 500 에러를 반환
    // TDD(테스트 주도 개발) 관점에서는 이 테스트가 404를 기대하도록 작성하고 코드를 수정하는 것이 맞지만, 현재는 있는 그대로의 테스트만 작성함
  });
});
