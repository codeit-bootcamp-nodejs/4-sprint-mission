import { Request, Response } from 'express';
import { create } from 'superstruct';
import prismaClient from '../lib/prismaClient';
import NotFoundError from '../lib/errors/NotFoundError';
import { IdParamsStruct } from '../structs/commonStructs';
import {
  CreateProductBodyStruct,
  GetProductListParamsStruct,
  UpdateProductBodyStruct,
} from '../structs/productsStruct';
import { CreateCommentBodyStruct, GetCommentListParamsStruct } from '../structs/commentsStruct';
import UnauthorizedError from '../lib/errors/UnauthorizedError';
import ForbiddenError from '../lib/errors/ForbiddenError';
import BadRequestError from '../lib/errors/BadRequestError';
import { Favorite, Prisma } from '@prisma/client';

export async function createProduct(req: Request, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const data = create(req.body, CreateProductBodyStruct);

  const createdProduct = await prismaClient.product.create({
    data: {
      ...data,
      userId: req.user.id,
    },
  });

  res.status(201).send(createdProduct);
}

export async function getProduct(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);

  const product = await prismaClient.product.findUnique({
    where: { id },
    include: { favorites: true, user: true },
  });
  if (!product) {
    throw new NotFoundError('product', id);
  }

  const productWithFavorites = {
    ...product,
    favorites: undefined,
    favoriteCount: product.favorites.length,
    isFavorited: req.user
      ? product.favorites.some((favorite: Favorite) => favorite.userId === req.user.id)
      : undefined,
  };

  res.send(productWithFavorites);
}

export async function updateProduct(req: Request, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { id } = create(req.params, IdParamsStruct);
  const { name, description, price, tags, images } = create(req.body, UpdateProductBodyStruct);

  const existingProduct = await prismaClient.product.findUnique({ where: { id } });
  if (!existingProduct) {
    throw new NotFoundError('product', id);
  }

  if (existingProduct.userId !== req.user.id) {
    throw new ForbiddenError('Should be the owner of the product');
  }

  const updatedProduct = await prismaClient.product.update({
    where: { id },
    data: { name, description, price, tags, images },
  });

  res.send(updatedProduct);
}

export async function deleteProduct(req: Request, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { id } = create(req.params, IdParamsStruct);
  const existingProduct = await prismaClient.product.findUnique({ where: { id } });

  if (!existingProduct) {
    throw new NotFoundError('product', id);
  }

  if (existingProduct.userId !== req.user.id) {
    throw new ForbiddenError('Should be the owner of the product');
  }

  await prismaClient.product.delete({ where: { id } });
  res.status(204).send();
}

export async function getProductList(req: Request, res: Response) {
  const { page, pageSize, orderBy, keyword } = create(req.query, GetProductListParamsStruct);

  const where = keyword
    ? {
        OR: [{ name: { contains: keyword } }, { description: { contains: keyword } }],
      }
    : undefined;

  const totalCount = await prismaClient.product.count({ where });
  const products = await prismaClient.product.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: orderBy === 'recent' ? { id: 'desc' } : { id: 'asc' },
    where,
    include: {
      favorites: true,
      user: true,
    },
  });

  const productsWithFavorites = products.map(
    (product: Prisma.ProductGetPayload<{ include: { favorites: true; user: true } }>) => ({
      ...product,
      favorites: undefined,
      favoriteCount: product.favorites.length,
      isFavorited: req.user
        ? product.favorites.some((favorite: Favorite) => favorite.userId === req.user.id)
        : undefined,
    })
  );

  res.send({
    list: productsWithFavorites,
    totalCount,
  });
}

export async function createComment(req: Request, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { id: productId } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, CreateCommentBodyStruct);

  const existingProduct = await prismaClient.product.findUnique({ where: { id: productId } });
  if (!existingProduct) {
    throw new NotFoundError('product', productId);
  }

  const createdComment = await prismaClient.comment.create({
    data: { productId, content, userId: req.user.id },
  });

  res.status(201).send(createdComment);
}

export async function getCommentList(req: Request, res: Response) {
  const { id: productId } = create(req.params, IdParamsStruct);
  const { cursor, limit } = create(req.query, GetCommentListParamsStruct);

  const existingProduct = await prismaClient.product.findUnique({ where: { id: productId } });
  if (!existingProduct) {
    throw new NotFoundError('product', productId);
  }

  const commentsWithCursorComment = await prismaClient.comment.findMany({
    cursor: cursor ? { id: cursor } : undefined,
    take: limit + 1,
    where: { productId },
    include: {
      user: true,
    },
  });
  const comments = commentsWithCursorComment.slice(0, limit);
  const cursorComment = commentsWithCursorComment[comments.length - 1];
  const nextCursor = cursorComment ? cursorComment.id : null;

  res.send({
    list: comments,
    nextCursor,
  });
}

export async function createFavorite(req: Request, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { id: productId } = create(req.params, IdParamsStruct);

  const existingProduct = await prismaClient.product.findUnique({ where: { id: productId } });
  if (!existingProduct) {
    throw new NotFoundError('product', productId);
  }

  const existingFavorite = await prismaClient.favorite.findFirst({
    where: { productId, userId: req.user.id },
  });
  if (existingFavorite) {
    throw new BadRequestError('Already favorited');
  }

  await prismaClient.favorite.create({ data: { productId, userId: req.user.id } });
  res.status(201).send();
}

export async function deleteFavorite(req: Request, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { id: productId } = create(req.params, IdParamsStruct);

  const existingFavorite = await prismaClient.favorite.findFirst({
    where: { productId, userId: req.user.id },
  });
  if (!existingFavorite) {
    throw new BadRequestError('Not favorited');
  }

  await prismaClient.favorite.delete({ where: { id: existingFavorite.id } });
  res.status(204).send();
}
