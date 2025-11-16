import { Request, Response } from 'express';
import { create } from 'superstruct';
import prismaClient from '../lib/prismaClient';
import { UpdateCommentBodyStruct } from '../structs/commentsStruct';
import NotFoundError from '../lib/errors/NotFoundError';
import { IdParamsStruct } from '../structs/commonStructs';
import UnauthorizedError from '../lib/errors/UnauthorizedError';
import ForbiddenError from '../lib/errors/ForbiddenError';

export async function updateComment(req: Request, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { id } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, UpdateCommentBodyStruct);

  const existingComment = await prismaClient.comment.findUnique({ where: { id } });
  if (!existingComment) {
    throw new NotFoundError('comment', id);
  }

  if (existingComment.userId !== req.user.id) {
    throw new ForbiddenError('Should be the owner of the comment');
  }

  const updatedComment = await prismaClient.comment.update({
    where: { id },
    data: { content },
  });

  res.send(updatedComment);
}

export async function deleteComment(req: Request, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { id } = create(req.params, IdParamsStruct);

  const existingComment = await prismaClient.comment.findUnique({ where: { id } });
  if (!existingComment) {
    throw new NotFoundError('comment', id);
  }

  if (existingComment.userId !== req.user.id) {
    throw new ForbiddenError('Should be the owner of the comment');
  }

  await prismaClient.comment.delete({ where: { id } });
  res.status(204).send();
}
