import prisma from "../../lib/prisma.js";
import createError from "http-errors";
import type { NextFunction, Request, Response } from "express";
import { sendNotificationToUser } from "../../lib/socket-manager.js";

const updateArticleComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const reqId = Number(req.params.id);
  if (!req.user) {
    return next(createError(401, "Unauthorized"));
  }

  try {
    const result = await prisma.comment.update({
      where: { id: reqId, ownerId: req.user.id },
      data: {
        content: req.body.content,
      },
    });

    if (req.user.id != result.ownerId) {
      sendNotificationToUser(
        String(result.ownerId),
        "새로운 댓글이 달렸습니다.",
        "ARTICLE_COMMENT_CREATE"
      );
    }

    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};

export default updateArticleComment;
