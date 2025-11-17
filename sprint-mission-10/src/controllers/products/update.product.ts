import prisma from "../../lib/prisma.js";
import createError from "http-errors";
import type { NextFunction, Request, Response } from "express";
import { sendAdHocGroupNotification } from "../../lib/socket-manager.js";

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

    if (req.body.price) {
      const result = await prisma.product.findUnique({
        where: { id: reqId },
        select: {
          likedUsers: true,
        },
      });

      if (!result) return;

      const ids = result?.likedUsers.map((item) => item.id);

      sendAdHocGroupNotification(ids, "가격이 변경되었습니다.");
    }

    res.status(200).send(product);
  } catch (err) {
    next(err);
  }
};

export default updateProduct;
