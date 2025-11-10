import prisma from "../../lib/prisma.js";

import type { NextFunction, Request, Response } from "express";

const getProductList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    offset = 0,
    limit = 10,
    order = "recent",
    name = "",
    description = "",
  } = req.query;

  let sort: "asc" | "desc" = "desc";
  if (order == "recent") sort = "desc";
  else if (order == "lastest") sort = "asc";
  else sort = "desc";
  try {
    const products = await prisma.product.findMany({
      where: {
        name: { contains: String(name) },
        description: { contains: String(description) },
      },
      skip: Number(offset),
      take: Number(limit),
      orderBy: {
        updateAt: sort,
      },
    });

    res.status(200).send(products);
  } catch (err) {
    next(err);
  }
};

export default getProductList;
