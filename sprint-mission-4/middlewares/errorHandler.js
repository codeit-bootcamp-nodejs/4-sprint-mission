import { Prisma } from "@prisma/client";

export default function ErrorHandler(err, req, res, next) {
  console.error("에러 : " + err);

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      return res.status(404).json({ message: "데이터를 찾을 수 없습니다." });
    }
  }

  const status = Number(err.status);
  const message = err.message;

  res.status(status).send(`에러 메시지 : ${message}`);
}
