import dotenv from "dotenv";

dotenv.config();

export const NODE_ENV = process.env.NODE_ENV || "development";
export const PORT: number = parseInt(process.env.PORT || "3000", 10);
export const JWT_ACCESS_TOKEN_SECRET: string =
  process.env.JWT_ACCESS_TOKEN_SECRET || "your_jwt_access_token_secret";
export const JWT_REFRESH_TOKEN_SECRET: string =
  process.env.JWT_REFRESH_TOKEN_SECRET || "your_jwt_refresh_token_secret";
export const ACCESS_TOKEN_COOKIE_NAME = "access-token";
export const REFRESH_TOKEN_COOKIE_NAME = "refresh-token";
