import dotenv from "dotenv";

dotenv.config();

const NODE_ENV = process.env.NODE_ENV;
const PORT = process.env.PORT || 3001;
const JWT_ACCESS_TOKEN_SECRET =
  process.env.JWT_ACCESS_TOKEN_SECRET || "your_jwt_access_token_secret";
const JWT_REFRESH_TOKEN_SECRET =
  process.env.JWT_REFRESH_TOKEN_SECRET || "your_jwt_access_token_secret";
const ACCESS_TOKEN_COOKIE_NAME = "acces-token";
const REFRESH_TOKEN_COOKIE_NAME = "refresh-token";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

export {
  NODE_ENV,
  PORT,
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
};
