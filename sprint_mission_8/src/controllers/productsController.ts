import { Request, Response } from 'express';
import { create } from 'superstruct';
import { IdParamsStruct } from '../structs/commonStructs';
import {
  CreateProductBodyStruct,
  GetProductListParamsStruct,
  UpdateProductBodyStruct,
} from '../structs/productsStruct';
import { CreateCommentBodyStruct, GetCommentListParamsStruct } from '../structs/commentsStruct';
import * as productsService from '../services/productsService';
import * as commentsService from '../services/commentsService';
import * as favoritesService from '../services/favoritesService';

export async function createProduct(req: Request, res: Response) {
  const data = create(req.body, CreateProductBodyStruct);
  const createdProduct = await productsService.createProduct({
    ...data,
    userId: req.user.id,
  });
  res.status(201).send(createdProduct);
}

export async function getProduct(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  const product = await productsService.getProduct(id);
  res.send(product);
}

export async function updateProduct(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  const data = create(req.body, UpdateProductBodyStruct);
  const updatedProduct = await productsService.updateProduct(id, {
    ...data,
    userId: req.user.id,
  });
  res.send(updatedProduct);
}

export async function deleteProduct(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  await productsService.deleteProduct(id, req.user.id);
  res.status(204).send();
}

export async function getProductList(req: Request, res: Response) {
  const params = create(req.query, GetProductListParamsStruct);
  const result = await productsService.getProductList(params, {
    userId: req.user?.id,
  });
  res.send(result);
}

export async function createComment(req: Request, res: Response) {
  const data = create(req.body, CreateCommentBodyStruct);
  const createdComment = await commentsService.createComment({
    ...data,
    userId: req.user.id,
  });
  res.status(201).send(createdComment);
}

export async function getCommentList(req: Request, res: Response) {
  const { id: productId } = create(req.params, IdParamsStruct);
  const params = create(req.query, GetCommentListParamsStruct);
  const result = await commentsService.getCommentListByProductId(productId, params);
  res.send(result);
}

export async function createFavorite(req: Request, res: Response) {
  const { id: productId } = create(req.params, IdParamsStruct);
  await favoritesService.createFavorite(productId, req.user.id);
  res.status(201).send();
}

export async function deleteFavorite(req: Request, res: Response) {
  const { id: productId } = create(req.params, IdParamsStruct);
  await favoritesService.deleteFavorite(productId, req.user.id);
  res.status(204).send();
}
