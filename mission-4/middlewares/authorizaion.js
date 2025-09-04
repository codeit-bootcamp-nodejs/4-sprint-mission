import prisma from "../lib/prisma.js";

export default function authorization(domain) {
  return async (req, res, next) => {
    try {
      const id = req.parsedId;
      const user = req.user;
      const data = await prisma[domain].findUniqueOrThrow({
        where: id,
        select: {
          userId: true,
        },
      });
      if (user.id !== data.userId) {
        return res.status(403).json("권한이 없습니다.");
      }
      next();
    } catch (e) {
      console.error(e);
      if (e.code === "P2025") {
        return res.status(404).json({ error: "요청한 데이터를 찾을 수 없습니다." });
      }
      return res.status(400).json("권한 인증에 실패했습니다.");
    }
  };
}
