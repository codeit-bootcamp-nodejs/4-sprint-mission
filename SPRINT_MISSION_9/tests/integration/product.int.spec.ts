import { api } from "../setup/setup";

describe("상품 API", () => {
  it("GET /products", async () => {
    const res = await api.get("/products");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
