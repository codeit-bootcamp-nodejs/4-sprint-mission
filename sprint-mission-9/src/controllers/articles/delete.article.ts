import prisma from "../../lib/prisma.js";
import createError from "http-errors";
import type { NextFunction, Request, Response } from "express";

const deleteArticle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const reqId = Number(req.params.id);
  if (!req.user) {
    return next(createError(401, "Unauthorized"));
  }

  try {
    await prisma.article.delete({
      where: { id: reqId, ownerId: req.user.id },
    });

    res.status(200).json({ message: "Delete Success" });
  } catch (err) {
    next(err);
  }
};

export default deleteArticle;
