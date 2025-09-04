import jwt from "jsonwebtoken";
import prisma from "../libs/prismaClient.js";
import { ACCESS_TOKEN_SECRET } from "../libs/constants.js";

export default async function authenticate(req, res, next) {
  const { accessToken } = req.cookies;

  if (!accessToken) {
    const error = new Error("인증 토큰이 필요합니다.");
    error.statusCode = 401;
    return next(error);
  }

  try {
    const decoded = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
    const userId = decoded.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      const error = new Error("토큰에 해당하는 사용자를 찾을 수 없습니다.");
      error.statusCode = 404;
      return next(error);
    }

    req.user = user;
    next();
  } catch (err) {
    let message;
    if (err.name === "TokenExpiredError") {
      message = "토큰이 만료되었습니다.";
    } else {
      message = "유효하지 않은 토큰입니다.";
    }
    const error = new Error(message);
    error.statusCode = 401;
    next(error);
  }
}
