import express from "express";
import prisma from "../lib/prisma.js";
import passport from "../lib/passport/index.js";
import status from "http-status";

const router = express.Router();

router.post(
  "/like/articles/:id",
  passport.authenticate("access-token", { session: false }),
  likeArticle
);
router.post(
  "/like/products/:id",
  passport.authenticate("access-token", { session: false }),
  likeProduct
);
router.get(
  "/like/articles",
  passport.authenticate("access-token", { session: false }),
  getLikedArticles
);
router.get(
  "/like/products",
  passport.authenticate("access-token", { session: false }),
  getLikedProducts
);

async function likeArticle(req, res, next) {
  const user = req.user;
  const articleId = Number(req.params.id);

  try {
    const article = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      return res
        .status(status.NOT_FOUND)
        .json({ message: "Article not found" });
    }
    const existing = await prisma.like.findUnique({
      where: {
        userId_articleId: { userId: user.id, articleId },
      },
    });

    if (existing) {
      const updated = await prisma.like.update({
        where: {
          userId_articleId: { userId: user.id, articleId },
        },
        data: {
          like: !existing.like,
        },
      });
      return res
        .status(status.OK)
        .json({ message: "Like toggled", isliked: updated.like });
    } else {
      const created = await prisma.like.create({
        data: {
          like: true,
          articleId,
          userId: user.id,
        },
      });
      return res
        .status(status.CREATED)
        .json({ message: "Liked successfully", like: created.like });
    }
  } catch (err) {
    next(err);
  }
}

async function likeProduct(req, res, next) {
  const user = req.user;
  const productId = Number(req.params.id);

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res
        .status(status.NOT_FOUND)
        .json({ message: "Product not found" });
    }

    const existing = await prisma.like.findUnique({
      where: {
        userId_productId: { userId: user.id, productId },
      },
    });

    if (existing) {
      const updated = await prisma.like.update({
        where: {
          userId_productId: { userId: user.id, productId },
        },
        data: {
          like: !existing.like,
        },
      });
      return res
        .status(status.OK)
        .json({ message: "Like toggled", isLiked: updated.like });
    } else {
      const created = await prisma.like.create({
        data: {
          like: true,
          productId,
          userId: user.id,
        },
      });
      return res
        .status(status.CREATED)
        .json({ message: "Liked successfully", isLiked: created.like });
    }
  } catch (err) {
    next(err);
  }
}

async function getLikedArticles(req, res, next) {
  const user = req.user;

  try {
    const likedArticles = await prisma.like.findMany({
      where: {
        userId: user.id,
        articleId: { not: null },
        like: true,
      },
      include: {
        article: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!likedArticles) {
      return res
        .status(status.NOT_FOUND)
        .json({ message: "Articles not found" });
    }

    const articles = likedArticles.map((l) => ({
      ...l.article,
      isLiked: true,
    }));

    res.status(status.OK).json(articles);
  } catch (err) {
    next(err);
  }
}

async function getLikedProducts(req, res, next) {
  const user = req.user;

  try {
    const likedProducts = await prisma.like.findMany({
      where: {
        userId: user.id,
        productId: { not: null },
        like: true,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            tags: true,
          },
        },
      },
    });

    if (!likedProducts) {
      return res
        .status(status.NOT_FOUND)
        .json({ message: "Product not found" });
    }

    const products = likedProducts.map((l) => ({
      ...l.product,
      isLiked: true,
    }));

    res.status(status.OK).json(products);
  } catch (err) {
    next(err);
  }
}

export default router;
