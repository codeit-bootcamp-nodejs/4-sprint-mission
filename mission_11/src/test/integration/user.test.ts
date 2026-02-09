import request from "supertest";
import { httpServer as app } from "../../app.js";
import { getAuthToken } from "../util/getAuthToken.js";
import { PrismaClient } from "@prisma/client";

const mockUser = {
  email: "testtest@example.com",
  nickname: "test",
  password: "password123",
};

const prisma = new PrismaClient();

afterAll(async () => {
  await prisma.user.deleteMany({
    where: {
      email: mockUser.email,
    },
  });
});

describe("User Integration Test", () => {
  describe("POST /users", () => {
    it("should return a id of user newly created", async () => {
      const response = await request(app)
        .post("/users")
        .send(mockUser)
        .expect(200);
      expect(response.body).toHaveProperty("userId");
    });

    it("should return 400 status code", async () => {
      const response = await request(app).post("/users").send({}).expect(400);
    });
  });

  describe("POST /login", () => {
    it("should return a string of accessToken", async () => {
      const accessToken = await getAuthToken(mockUser.email, mockUser.password);
      expect(typeof accessToken).toBe("string");
    });
  });
});
