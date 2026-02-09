import request from "supertest";
import { httpServer as app } from "../../app.js";

export const getAuthToken = async (email: string, password: string) => {
  const userData = {
    /* email: "user1@example.com",
    password: "password123", */
    email,
    password,
  };

  const response = await request(app).post("/login").send(userData).expect(200);

  const { accessToken } = response.body;
  return accessToken;
};
