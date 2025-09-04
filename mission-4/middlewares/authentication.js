import { verifyAccessToken } from "../lib/jwtToken.js";
import prisma from "../lib/prisma.js";

export default function authentication() {
  return async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "인증이 유효하지 않습니다." });
    }
    const token = authHeader.split(" ")[1];
    try {
      const result = verifyAccessToken(token);
      const user = await prisma.user.findUniqueOrThrow({
        where: {
          id: result.id,
        },
        select: {
          id: true,
          email: true,
          nickname: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      req.user = user;
      next();
    } catch (e) {
      console.error(e);
      return res.status(401).json({ error: "인증이 유효하지 않습니다." });
    }
  };
}
