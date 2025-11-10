import prisma from "../../lib/prisma.js";
import createError from "http-errors";
import type { NextFunction, Request, Response } from "express";

const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return next(createError(401, "Unauthorized"));
  }

  try {
    const product = await prisma.product.create({
      data: {
        ...req.body,
        owner: {
          connect: {
            id: req.user.id,
          },
        },
      },
    });

    if (req.file) {
      return res.status(200).json({
        message: "파일 업로드 성공",
        body: product,
        filename: req.file.filename,
        filepath: `../image/${req.file.filename}`,
      });
    }

    res.status(200).send(product);
  } catch (err) {
    next(err);
  }
};

export default createProduct;
