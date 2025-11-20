import { Request, Response } from 'express';
import { create } from 'superstruct';
import { IdParamsStruct } from '../structs/commonStructs';
import { CreateArticleBodyStruct, UpdateArticleBodyStruct } from '../structs/articlesStructs';
import * as articlesService from '../services/articlesService';

export async function createArticle(req: Request, res: Response) {
  const data = create(req.body, CreateArticleBodyStruct);
  const article = await articlesService.createArticle({
    ...data,
    image: data.image ?? null,
    userId: req.user!.id,
  });
  res.status(201).json(article);
}

export async function getArticle(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  const article = await articlesService.getArticle(id);
  res.json(article);
}

export async function updateArticle(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  const data = create(req.body, UpdateArticleBodyStruct);
  const article = await articlesService.updateArticle(id, req.user!.id, data);
  res.json(article);
}

export async function deleteArticle(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  await articlesService.deleteArticle(id, req.user!.id);
  res.status(204).send();
}
