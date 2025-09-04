import jwt from "jsonwebtoken";
import { JWT_ACCESS_TOKEN_SECRET, JWT_REFRESH_TOKEN_SECRET } from "./constants.js";

function generateToken(userid) {
  const accessToken = jwt.sign({ id: userid }, JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });
  const refreshToken = jwt.sign({ id: userid }, JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: "24h",
  });
  return { accessToken, refreshToken };
}

function verifyAccessToken(token) {
  const result = jwt.verify(token, JWT_ACCESS_TOKEN_SECRET);
  return { id: result.id };
}
function verifyRefreshToken(token) {
  const result = jwt.verify(token, JWT_REFRESH_TOKEN_SECRET);
  return { id: result.id };
}
export { generateToken, verifyAccessToken, verifyRefreshToken };
