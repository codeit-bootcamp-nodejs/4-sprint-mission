import request from "supertest";
import { httpServer as app } from "../../app.js";
import { PrismaClient } from "@prisma/client";

const mockUser = {
  email: "test@example.com",
  nickname: "test",
  password: "password123",
};

let productId: number;
let userId: number;

const prisma = new PrismaClient();

beforeAll(async () => {
  // Delete user if it exists to ensure a clean slate
  const existingUser = await prisma.user.findUnique({
    where: { email: mockUser.email },
  });
  if (existingUser) {
    await prisma.user.delete({ where: { id: existingUser.id } });
  }

  const response = await request(app).post("/users").send(mockUser);
  userId = response.body.userId;

  const res = await prisma.product.create({
    data: {
      name: "Test Product",
      description: "Test Product Desc",
      price: 10010,
      userId: userId,
    },
  });

  productId = res.id;
});

afterAll(async () => {
  await prisma.user.deleteMany({
    where: {
      email: mockUser.email,
    },
  });
});

describe("Product Integration Test (No Auth)", () => {
  describe("GET /products", () => {
    it("should return a list of products", async () => {
      const response = await request(app).get("/products").expect(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("GET /products/:id", () => {
    it("should return a specific product by ID", async () => {
      const response = await request(app)
        .get(`/products/${productId}`)
        .expect(200);

      expect(response.body).toHaveProperty("id");
    });

    it("should return 404 for non-existing product", async () => {
      const nonExistingId = 9999;
      await request(app).get(`/products/${nonExistingId}`).expect(404);
    });
  });

  describe("GET /products/:id/comments", () => {
    it("should return comments for a specific product", async () => {
      const response = await request(app)
        .get(`/products/${productId}/comments`)
        .expect(200);
      expect(Array.isArray(response.body.comments)).toBe(true);
    });

    it("should return 404 for comments of non-existing product", async () => {
      const nonExistingId = 9999;
      await request(app).get(`/products/${nonExistingId}/comments`).expect(404);
    });
  });
});
