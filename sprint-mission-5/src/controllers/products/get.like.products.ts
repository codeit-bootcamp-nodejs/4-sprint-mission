import createError from "http-errors";
import prisma from "../../lib/prisma.js";
import type { NextFunction, Request, Response } from "express";

export default async function getLikeProducts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    return next(createError(401, "Unauthorized"));
  }
  try {
    const product = await prisma.user.findUniqueOrThrow({
      where: {
        id: req.user.id,
      },
      select: {
        likeProducts: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const result = product.likeProducts;
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
