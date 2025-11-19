import { api } from "../setup/setup";

describe("게시글 API", () => {
  it("GET /posts", async () => {
    const res = await api.get("/posts");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
