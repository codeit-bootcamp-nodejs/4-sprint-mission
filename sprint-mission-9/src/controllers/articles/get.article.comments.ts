import prisma from "../../lib/prisma.js";
import type { NextFunction, Request, Response } from "express";

const getArticleComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const reqId = Number(req.params.id);
  let cursor = 1;

  try {
    if (req.query.cursor) cursor = Number(req.query.cursor);

    const result = await prisma.article.findMany({
      where: {
        id: reqId,
      },
      select: {
        comments: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      cursor: { id: cursor },
      take: 10,
    });
    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};

export default getArticleComment;
