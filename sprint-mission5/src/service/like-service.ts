import { PrismaClient } from '@prisma/client';
import type { Request, Response } from 'express';

const prisma = new PrismaClient();

const articleLike = async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const articleId = req.params.articleId ? parseInt(req.params.articleId, 10) : undefined;
  const articleLike = await prisma.articleLike.create({
    data: {
      article: { connect: { id: articleId } },
      user: { connect: { id: userId } },
    }
  });
  res.status(201).send(articleLike);
}

const articleUnLike = async (req: Request, res: Response) => {
  const articleUnLike = await prisma.articleLike.delete({
    where: { id: Number(req.params.articleLikeId) }
  })
  res.status(201).send(articleUnLike);
}

const productLike = async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const productId = req.params.productId ? parseInt(req.params.productId, 10) : undefined;
  const productLike = await prisma.productLike.create({
    data: {
      product: { connect: { id: productId } },
      user: { connect: { id: userId } },
    }
  });
  res.status(201).send(productLike);
}

const productUnLike = async (req: Request, res: Response) => {
  const productUnLike = await prisma.productLike.delete({
    where: { id: Number(req.params.productLikeId) }
  })
  res.status(201).send(productUnLike);
}

export default {
  articleLike,
  articleUnLike,
  productLike,
  productUnLike
}