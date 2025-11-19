import { Request, Response } from 'express';
import { create } from 'superstruct';
import { IdParamsStruct } from '../structs/commonStructs';
import {
  CreateArticleBodyStruct,
  UpdateArticleBodyStruct,
  GetArticleListParamsStruct,
} from '../structs/articlesStructs';
import { CreateCommentBodyStruct, GetCommentListParamsStruct } from '../structs/commentsStruct';
import * as articlesService from '../services/articlesService';
import * as commentsService from '../services/commentsService';
import * as likesService from '../services/likesService';

export async function createArticle(req: Request, res: Response) {
  const data = create(req.body, CreateArticleBodyStruct);
  const article = await articlesService.createArticle({
    ...data,
    userId: req.user.id,
  });
  res.status(201).send(article);
}

export async function getArticle(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  const article = await articlesService.getArticle(id);
  res.send(article);
}

export async function updateArticle(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  const data = create(req.body, UpdateArticleBodyStruct);
  const updatedArticle = await articlesService.updateArticle(id, {
    ...data,
    userId: req.user.id,
  });
  res.send(updatedArticle);
}

export async function deleteArticle(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  await articlesService.deleteArticle(id, req.user.id);
  res.status(204).send();
}

export async function getArticleList(req: Request, res: Response) {
  const params = create(req.query, GetArticleListParamsStruct);
  const result = await articlesService.getArticleList(params);
  res.send(result);
}

export async function createComment(req: Request, res: Response) {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, CreateCommentBodyStruct);
  const createdComment = await commentsService.createComment({
    articleId,
    content,
    userId: req.user.id,
  });
  res.status(201).send(createdComment);
}

export async function getCommentList(req: Request, res: Response) {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const { cursor, limit } = create(req.query, GetCommentListParamsStruct);
  const result = await commentsService.getCommentListByArticleId(articleId, { cursor, limit });
  res.send(result);
}

export async function createLike(req: Request, res: Response) {
  const { id: articleId } = create(req.params, IdParamsStruct);
  await likesService.createLike(articleId, req.user.id);
  res.status(201).send();
}

export async function deleteLike(req: Request, res: Response) {
  const { id: articleId } = create(req.params, IdParamsStruct);
  await likesService.deleteLike(articleId, req.user.id);
  res.status(204).send();
}
