import { Request, Response } from 'express';
import { create } from 'superstruct';
import { IdParamsStruct } from '../structs/commonStructs';
import { CreateCommentBodyStruct, UpdateCommentBodyStruct } from '../structs/commentsStructs';
import * as commentsService from '../services/commentsService';

export async function createComment(req: Request, res: Response) {
  const data = create(req.body, CreateCommentBodyStruct);
  const comment = await commentsService.createComment({
    ...data,
    userId: req.user!.id,
  });
  res.status(201).json(comment);
}

export async function updateComment(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, UpdateCommentBodyStruct);
  const comment = await commentsService.updateComment(id, req.user!.id, content);
  res.json(comment);
}

export async function deleteComment(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  await commentsService.deleteComment(id, req.user!.id);
  res.status(204).send();
}
