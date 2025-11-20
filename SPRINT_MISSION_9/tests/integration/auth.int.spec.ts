import { api } from "../setup/setup";

describe("인증 API", () => {
  it("POST /auth/signup", async () => {
    const res = await api.post("/auth/signup").send({
      email: "test@test.com",
      password: "1234"
    });

    expect(res.status).toBe(201);
  });

  it("POST /auth/login", async () => {
    const res = await api.post("/auth/login").send({
      email: "test@test.com",
      password: "1234"
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});
