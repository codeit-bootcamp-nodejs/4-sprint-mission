import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "./constants.js";

function generateTokens(userId) {
  const accessToken = jwt.sign({ id: userId }, ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });
  const refreshToken = jwt.sign({ id: userId }, REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
}

export { generateTokens };
