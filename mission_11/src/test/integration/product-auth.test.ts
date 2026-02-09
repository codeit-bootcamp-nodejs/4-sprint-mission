import request from "supertest";
import { httpServer as app } from "../../app.js";
import { PrismaClient } from "@prisma/client";
import { getAuthToken } from "../util/getAuthToken.js";

const prisma = new PrismaClient();

let authToken: string;
let userId: number;
let productId: number;
let commentId: number;

const mockUser = {
  email: "product-auth-user@test.com",
  nickname: "test-product-auth",
  password: "password123",
};

const mockProduct = {
  name: "Auth Test Product",
  description: "This is an auth test product.",
  price: 50000,
  tags: [],
};

const mockComment = {
  name: "product-comment-author",
  content: "Example product auth comment",
};

beforeAll(async () => {
  const existingUser = await prisma.user.findUnique({
    where: { email: mockUser.email },
  });
  if (existingUser) {
    await prisma.user.delete({ where: { id: existingUser.id } });
  }

  await request(app).post("/users").send(mockUser);
  authToken = await getAuthToken(mockUser.email, mockUser.password);
  const user = await prisma.user.findUnique({
    where: { email: mockUser.email },
  });
  userId = user!.id;

  const productResponse = await request(app)
    .post("/products")
    .set("Authorization", `Bearer ${authToken}`)
    .send({ ...mockProduct, userId });
  productId = productResponse.body.id;

  const commentResponse = await request(app)
    .post(`/products/${productId}/comments`)
    .set("Authorization", `Bearer ${authToken}`)
    .send({ ...mockComment, userId });
  commentId = commentResponse.body.id;
});

afterAll(async () => {
  await prisma.user.delete({ where: { id: userId } });
  authToken = "";
});

describe("Product Integration Test (Auth)", () => {
  describe("POST /products", () => {
    it("should upload another product and return its properties", async () => {
      const anotherMockProduct = {
        name: "Another Auth Product",
        description: "Another one.",
        price: 100,
        tags: ["new"],
      };

      const response = await request(app)
        .post("/products")
        .set("Authorization", `Bearer ${authToken}`)
        .send(anotherMockProduct)
        .expect(201);
      expect(response.body).toEqual(
        expect.objectContaining({ id: expect.any(Number) })
      );
      await prisma.product.delete({ where: { id: response.body.id } });
    });
  });

  describe("PATCH /products/:id", () => {
    it("should update a specific product by ID", async () => {
      const updatedData = {
        price: 9999,
      };

      const response = await request(app)
        .patch(`/products/${productId}`)
        .send(updatedData)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty("price", updatedData.price);
    });
  });

  describe("DELETE /products/:id", () => {
    it("should delete a specific product by ID", async () => {
      const tempProductRes = await request(app)
        .post("/products")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ ...mockProduct, name: "To Be Deleted" });
      const tempProductId = tempProductRes.body.id;

      const response = await request(app)
        .delete(`/products/${tempProductId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty("id", tempProductId);
    });
  });

  describe("POST /products/:id/comments", () => {
    it("should post another comment to a specific product", async () => {
      const anotherMockComment = {
        name: "another-product-commenter",
        content: "Another product comment",
      };

      const response = await request(app)
        .post(`/products/${productId}/comments`)
        .send(anotherMockComment)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(201);

      expect(response.body).toHaveProperty("id");
      await prisma.comment.delete({ where: { id: response.body.id } });
    });
  });

  describe("PATCH /products/:id/comments/:cid", () => {
    it("should update a specific comment by ID", async () => {
      const updatedComment = {
        name: "updated-product-commenter",
        content: "Updated product comment",
      };
      const response = await request(app)
        .patch(`/products/${productId}/comments/${commentId}`)
        .send(updatedComment)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty("content", updatedComment.content);
    });
  });

  describe("DELETE /products/:id/comments/:cid", () => {
    it("should delete a specific comment by ID", async () => {
      const tempCommentRes = await request(app)
        .post(`/products/${productId}/comments`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ name: "temp-user", content: "to be deleted" });
      const tempCommentId = tempCommentRes.body.id;

      const response = await request(app)
        .delete(`/products/${productId}/comments/${tempCommentId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty("id", tempCommentId);
    });
  });
});
