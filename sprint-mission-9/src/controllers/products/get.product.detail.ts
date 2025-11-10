import prisma from "../../lib/prisma.js";
import createError from "http-errors";
import type { NextFunction, Request, Response } from "express";

const getProductDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const reqId = Number(req.params.id);
  if (!req.user) {
    return next(createError(401, "Unauthorized"));
  }

  try {
    const product = await prisma.product.findUniqueOrThrow({
      where: {
        id: reqId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        tags: true,
        createdAt: true,

        likedUsers: {
          where: { id: req.user.id },
        },
      },
    });

    const isLiked = product.likedUsers.length > 0;

    const result = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      tags: product.tags,
      isLiked: isLiked,
      createdAt: product.createdAt,
    };

    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};

export default getProductDetail;
