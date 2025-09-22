import prisma from "../../lib/prisma.js";
import createError from "http-errors";
import type { NextFunction, Request, Response } from "express";

const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const reqId = Number(req.params.id);
  if (!req.user) {
    return next(createError(401, "Unauthorized"));
  }

  try {
    const product = await prisma.product.update({
      where: { id: reqId, ownerId: req.user.id },
      data: req.body,
    });

    res.status(200).send(product);
  } catch (err) {
    next(err);
  }
};

export default updateProduct;
