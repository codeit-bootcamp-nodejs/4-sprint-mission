import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const articleLike = async (req, res) => {
  const userId = req.user.userId;
  const articleId = parseInt(req.params.articleId, 10);
  const articleLike = await prisma.articleLike.create({
    data: {
      article: { connect: { id: articleId } },
      user: { connect: { id: userId } },
    }
  });
  res.status(201).send(articleLike);
}

const articleUnLike = async (req, res) => {
  const articleUnLike = await prisma.articleLike.delete({
    where: { id: Number(req.params.articleLikeId) }
  })
  res.status(201).send(articleUnLike);
}

const productLike = async (req, res) => {
  const userId = req.user.userId;
  const productId = parseInt(req.params.productId, 10);
  const productLike = await prisma.productLike.create({
    data: {
      product: { connect: { id: productId } },
      user: { connect: { id: userId } },
    }
  });
  res.status(201).send(productLike);
}

const productUnLike = async (req, res) => {
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