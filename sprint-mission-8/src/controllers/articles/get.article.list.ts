import prisma from "../../lib/prisma.js";

import type { NextFunction, Request, Response } from "express";

const getArticleList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    offset = 0,
    limit = 10,
    order = "recent",
    title = "",
    content = "",
  } = req.query;

  let sort: "asc" | "desc" = "desc";
  if (order == "recent") sort = "desc";
  else if (order == "lastest") sort = "asc";
  else sort = "desc";

  const resultes = await prisma.article.findMany({
    where: {
      title: { contains: String(title) },
      content: { contains: String(content) },
    },
    skip: Number(offset),
    take: Number(limit),
    orderBy: {
      createdAt: sort,
    },
  });

  res.status(200).send(resultes);
};

export default getArticleList;
