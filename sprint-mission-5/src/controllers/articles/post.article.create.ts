import prisma from "../../lib/prisma.js";
import createError from "http-errors";
import type { NextFunction, Request, Response } from "express";

const createArticle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return next(createError(401, "Unauthorized"));
  }

  try {
    const result = await prisma.article.create({
      data: {
        ...req.body,
        owner: {
          connect: {
            id: req.user.id,
          },
        },
      },
    });

    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};

export default createArticle;
