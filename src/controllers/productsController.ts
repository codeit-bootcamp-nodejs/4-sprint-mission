import { Request, Response } from 'express';
import { create } from 'superstruct';
import { IdParamsStruct } from '../structs/commonStructs';
import { CreateProductBodyStruct, UpdateProductBodyStruct } from '../structs/productsStructs';
import * as productsService from '../services/productsService';

export async function createProduct(req: Request, res: Response) {
  const data = create(req.body, CreateProductBodyStruct);
  const product = await productsService.createProduct({
    ...data,
    userId: req.user!.id,
  });
  res.status(201).json(product);
}

export async function getProduct(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  const product = await productsService.getProduct(id);
  res.json(product);
}

export async function updateProduct(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  const data = create(req.body, UpdateProductBodyStruct);
  const product = await productsService.updateProduct(id, {
    ...data,
    userId: req.user!.id,
  });
  res.json(product);
}

export async function deleteProduct(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  await productsService.deleteProduct(id, req.user!.id);
  res.status(204).send();
}
