import prisma from "../../lib/prisma.js";
import createError from "http-errors";
import type { NextFunction, Request, Response } from "express";

export default async function updateUserNotification(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      return next(createError(401, "Unauthorized"));
    }
    const notiId = req.params.id;

    const data = await prisma.notification.update({
      where: {
        id: Number(notiId),
      },
      data: {
        isRead: true,
      },
    });

    res.status(200).json({ message: "변경 성공함" });
  } catch (err) {
    next(err);
  }
}
