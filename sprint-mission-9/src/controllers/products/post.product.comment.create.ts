import prisma from "../../lib/prisma.js";
import createError from "http-errors";
import type { NextFunction, Request, Response } from "express";

const createProductComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const reqId = Number(req.params.id);
    if (!req.user) {
      return next(createError(401, "Unauthorized"));
    }

    const product = await prisma.product.findUnique({
      where: { id: reqId, ownerId: req.user.id },
    });
    if (!product)
      return next(createError(400, "목표 데이터를 찾을 수 없습니다"));

    const result = await prisma.comment.create({
      data: {
        content: req.body.content,
        productId: reqId,
        ownerId: req.user.id,
      },
    });

    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};

export default createProductComment;
