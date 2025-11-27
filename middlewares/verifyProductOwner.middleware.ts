import type { Response, Request, NextFunction } from "express";
import prisma from "../prisma/prisma.js";
import { HttpError } from "./errorHandler.middleware.js";

export async function verifyProductOwner(req: Request, res: Response, next: NextFunction) {
  try {
    const productId = Number(req.params.productId);

    if (!req.user) {
      throw new HttpError("로그인이 필요합니다.", 401);
    }
    const userId = Number(req.user.userId);

    const product  = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new HttpError("상품을 찾을 수 없습니다.", 404);
    }

    if (product.userId !== userId) {
      throw new HttpError("상품을 수정할 권한이 없습니다.", 403);
    }

    next();
  } catch (err) {
    next(err);
  }
}
