import express from 'express';
import prisma from '../lib/prisma.js';
import passport from '../lib/passport/index.js';

const router = express.Router();

router.post(
  '/like/articles/:id',
  passport.authenticate('access-token', { session: false }),
  likeArticle
);
router.post(
  '/like/products/:id',
  passport.authenticate('access-token', { session: false }),
  likeProduct
);
router.get(
  '/like/articles/:id',
  passport.authenticate('access-token', { session: false }),
  getArticles
);
router.get(
  '/like/products/:id',
  passport.authenticate('access-token', { session: false }),
  getProducts
);


async function likeArticle(req, res, next) {
    const user = req.user;
    const articleId = Number(req.params.id);

    try {
        const existing = await prisma.like.findUnique({
            where: {
                user_articleId: {
                    userId: user.id,
                    articleId,
                },
            },
        });

        if (existing) {
            const updated = await prisma.like.update({
                where: {
                    userId_articleId: {
                        userId: user.id,
                        articleId,
                    },
                },
                data: {
                    like: !existing.like,
                },
            });
            return res.status(200).json({ message: 'Like toggled', isliked: updated.like });
        } else {
            const created = await prisma.like.create({
                data: {
                    like: true,
                    articleId,
                    userId: user.id,
                },
            });
            return res.status(201).json({ message: 'Liked successfully', like: created.like });
        }
    } catch(err) {
        next(err);
    }
}

async function likeProduct(req, res, next) {
    const user = req.user;
    const productId = Number(req.params.id);

    try {
        const existing = await prisma.like.findUnique({
            where: {
                user_productId: {
                    userId: user.id,
                    productId,
                },
            },
        });

        if (existing) {
            const updated = await prisma.like.update({
                where: {
                    userId_productId: {
                        userId: user.id,
                        productId,
                    },
                },
                data: {
                    like: !existing.like,
                },
            });
            return res.status(200).json({ message: 'Like toggled', isLiked: updated.like });
        } else {
            const created = await prisma.like.create({
                data: {
                    like: true,
                    productId,
                    userId: user.id,
                },
            });
            return res.status(201).json({ message: 'Liked successfully', isLiked: created.like });
        }
    } catch(err) {
        next(err);
    }
}

async function getProducts(req, res, next) {
    const user = req.user;
    const productId = Number(req.params.id);

    try {
      const product = await prisma.product.findUnique({
        where: { id: productId },
        select: {
            id: true,
            name: true,
            price: true,
            tags: true
        }
      });

      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      // 좋아요 여부 확인
      const like = await prisma.like.findUnique({
        where: {
          userId_productId: {
            userId: user.id,
            productId,
          },
        },
      });

      res.json({
        ...product,
        isLiked: like ? like.like : false,
      });
    } catch (err) {
      next(err);
    }
  }

  async function getArticles(req, res, next) {
    const user = req.user;
    const articleId = Number(req.params.id);

    try {
      const article = await prisma.article.findUnique({
        where: { id: articleId },
        select: {
            id: true,
            name: true,
            price: true,
            tags: true
        }
      });

      if (!article) {
        return res.status(404).json({ message: 'Article not found' });
      }

      const like = await prisma.like.findUnique({
        where: {
          userId_articleId: {
            userId: user.id,
            articleId,
          },
        },
      });

      res.json({
        ...article,
        isLiked: like ? like.like : false,
      });
    } catch (err) {
      next(err);
    }
  }

export default router;