import type { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import prisma from "../../lib/prisma.js";

export default async function getUserNotifications(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    return next(createError(401, "Unauthorized"));
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        myNotification: true,
      },
    });

    res.status(200).json({
      data: { ...user?.myNotification },
    });
  } catch (err) {
    next(err);
  }
}
