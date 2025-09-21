import { Request, Response, NextFunction } from 'express';
import ProductService from '../ProductService';
import { Product as PrismaProduct, Prisma, Like } from '@prisma/client';
import prisma from '../index';
import { ProductCreateDto, ProductUpdateDto } from '../dtos/ProductDto';
import CommentService from '../CommentService';
import LikeService from '../LikeService';
import CommentRepository from '../repositories/CommentRepository';
import LikeRepository from '../repositories/LikeRepository';

class ProductsController {
  private productService: ProductService;
  private commentService: CommentService;
  private likeService: LikeService;

  constructor(productService: ProductService) {
    this.productService = productService;
    const commentRepository = new CommentRepository();
    this.commentService = new CommentService(commentRepository);
    const likeRepository = new LikeRepository();
    this.likeService = new LikeService(likeRepository);
  }

  createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, description, price }: ProductCreateDto = req.body;
      const { user } = req;

      if (!user) {
        return res.status(401).json({ message: '사용자 정보를 찾을 수 없습니다.' });
      }

      const product = await this.productService.createProduct({
        name,
        content: description, // Map description to content
        price,
        userId: user.id,
      });
      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  };

  getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sort, search } = req.query as { sort?: string; search?: string };
      let page = parseInt(req.query.page as string) || 1;
      let limit = parseInt(req.query.limit as string) || 10;
      let offset = (page - 1) * limit;

      const where: Prisma.ProductWhereInput = search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { content: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {};

      const user = req.user;
      const products = await this.productService.getProducts({
        where,
        orderBy: sort === 'recent' ? { createdAt: 'desc' } : undefined,
        skip: offset,
        take: limit,
      });

      let responseProducts: (PrismaProduct & { isLiked?: boolean })[] = products;

      if (user) {
        const productIds = products.map((product) => product.id);
        const likes = await this.likeService.findLikes({
          where: {
            userId: user.id,
            productId: { in: productIds },
          },
        });

        const likedProductIds = new Set(likes.map((like: Like) => like.productId));

        responseProducts = products.map((product) => ({
          ...product,
          isLiked: likedProductIds.has(product.id),
        }));
      } else {
        responseProducts = products.map((product) => ({
          ...product,
          isLiked: false,
        }));
      }

      res.status(200).json(responseProducts);
    } catch (error) {
      next(error);
    }
  };

  getProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { productId } = req.params;
      const user = req.user;

      const product = await this.productService.getProductById(parseInt(productId));

      if (!product) return res.status(404).json({ message: '상품을 찾을수 없습니다.' });

      let isLiked = false;
      if (user) {
        const like = await this.likeService.findLikeByUserIdAndProductId(
          user.id,
          parseInt(productId),
        );
        if (like) {
          isLiked = true;
        }
      }

      const responseProduct = { ...product, isLiked };
      res.status(200).json(responseProduct);
    } catch (error) {
      next(error);
    }
  };

  updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { productId } = req.params;
      const { name, description, price }: ProductUpdateDto = req.body;
      const { user } = req;

      if (!user) {
        return res.status(401).json({ message: '사용자 정보를 찾을 수 없습니다.' });
      }

      const product = await this.productService.getProductById(parseInt(productId));
      if (!product || product.userId !== user.id) {
        return res.status(403).json({ message: '상품 수정 권한이 없습니다.' });
      }

      const updatedProduct = await this.productService.updateProduct(parseInt(productId), {
        name,
        description,
        price,
      });
      res.status(200).json(updatedProduct);
    } catch (error) {
      next(error);
    }
  };

  deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { productId } = req.params;
      const { user } = req;

      if (!user) {
        return res.status(401).json({ message: '사용자 정보를 찾을 수 없습니다.' });
      }

      const product = await this.productService.getProductById(parseInt(productId));
      if (!product || product.userId !== user.id) {
        return res.status(403).json({ message: '상품 삭제 권한이 없습니다.' });
      }

      await this.productService.deleteProduct(parseInt(productId));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  createComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { productId } = req.params;
      const { content } = req.body;
      const { user } = req;

      if (!user) {
        return res.status(401).json({ message: '사용자 정보를 찾을 수 없습니다.' });
      }

      if (!content) return res.status(400).json({ message: '댓글을 입력해주세요.' });

      const newComment = await this.commentService.createComment({
        content,
        productId: parseInt(productId),
        userId: user.id,
      });
      res.status(201).json(newComment);
    } catch (error) {
      next(error);
    }
  };

  getComments = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { productId } = req.params;
      let cursor = req.query.cursor ? parseInt(req.query.cursor as string) : undefined;
      let limit = parseInt(req.query.limit as string) || 10;

      const comments = await this.commentService.getComments({
        where: { productId: parseInt(productId) },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: cursor ? 1 : 0,
      });
      res.status(200).json(comments);
    } catch (error) {
      next(error);
    }
  };

  updateComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { commentId } = req.params;
      const { content } = req.body;
      const { user } = req;

      if (!user) {
        return res.status(401).json({ message: '사용자 정보를 찾을 수 없습니다.' });
      }

      if (!content) return res.status(400).json({ message: '수정할 내용을 입력해주세요.' });

      const existingComment = await this.commentService.getCommentById(parseInt(commentId));
      if (!existingComment || existingComment.userId !== user.id) {
        return res.status(403).json({ message: '댓글 수정 권한이 없습니다.' });
      }

      const updatedComment = await this.commentService.updateComment(parseInt(commentId), {
        content,
      });
      res.status(200).json(updatedComment);
    } catch (error) {
      next(error);
    }
  };

  deleteComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { commentId } = req.params;
      const { user } = req;

      if (!user) {
        return res.status(401).json({ message: '사용자 정보를 찾을 수 없습니다.' });
      }

      const existingComment = await this.commentService.getCommentById(parseInt(commentId));
      if (!existingComment || existingComment.userId !== user.id) {
        return res.status(403).json({ message: '댓글 삭제 권한이 없습니다.' });
      }

      await this.commentService.deleteComment(parseInt(commentId));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  toggleLike = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { productId } = req.params;
      const { user } = req;

      if (!user) {
        return res.status(401).json({ message: '사용자 정보를 찾을 수 없습니다.' });
      }

      const product = await this.productService.getProductById(parseInt(productId));
      if (!product) {
        return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
      }

      const existingLike = await this.likeService.findLikeByUserIdAndProductId(
        user.id,
        parseInt(productId),
      );

      if (existingLike) {
        await this.likeService.deleteLike(existingLike.id);
        res.status(200).json({ message: '상품 좋아요를 취소했습니다.' });
      } else {
        await this.likeService.createLike({
          userId: user.id,
          productId: parseInt(productId),
        });
        res.status(201).json({ message: '상품에 좋아요를 눌렀습니다.' });
      }
    } catch (error) {
      next(error);
    }
  };
}

export default ProductsController;
