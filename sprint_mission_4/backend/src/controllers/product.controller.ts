// src/controllers/product.controller.js
import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma/client.js';
import { CreateProductRequest } from '../types/index.js';

interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    nickname: string;
  };
}

// 상품 생성 API
export const createProduct = async (req: AuthRequest & Request<{}, {}, CreateProductRequest>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, description, price, tags, imageUrl } = req.body;
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        tags,
        imageUrl: imageUrl || null,
        userId: req.user!.id,
      },
    });
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

// 상품 목록 조회 API
export const getAllProducts = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const offset = Math.max(0, parseInt(req.query['offset'] as string ?? '0', 10) || 0);
    const limitRaw = parseInt(req.query['limit'] as string ?? '10', 10);
    const limit = Math.min(50, Math.max(1, limitRaw || 10)); // 1~50로 클램프
    const search = ((req.query['search'] as string) ?? '').trim();
    const sort = req.query['sort'] as string;

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { description: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const orderBy = sort === 'recent' ? { createdAt: 'desc' as const } : {};

    const products = await prisma.product.findMany({
      skip: offset,
      take: limit,
      where,
      ...(Object.keys(orderBy).length > 0 && { orderBy }),
      select: { 
        id: true, 
        name: true, 
        price: true, 
        createdAt: true,
        _count: {
          select: { likes: true, comments: true }
        }
      },
    });

    const productsWithLikeStatus = await Promise.all(
      products.map(async (product) => {
        const isLiked = req.user
          ? await prisma.like.findFirst({
              where: { userId: req.user.id, productId: product.id }
            })
          : null;

        return {
          ...product,
          likeCount: product._count.likes,
          commentCount: product._count.comments,
          isLiked: !!isLiked,
        };
      })
    );

    res.json(productsWithLikeStatus);
  } catch (err) {
    next(err);
  }
};

// 상품 상세 조회 API
export const getProductById = async (req: AuthRequest & Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ error: 'Invalid id' });
      return;
    }
    const product = await prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        tags: true,
        createdAt: true,
        imageUrl: true,
        userId: true,
        _count: {
          select: { likes: true, comments: true }
        }
      },
    });
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    const isLiked = req.user
      ? await prisma.like.findFirst({
          where: { userId: req.user.id, productId: product.id }
        })
      : null;

    res.json({
      ...product,
      likeCount: product._count.likes,
      commentCount: product._count.comments,
      isLiked: !!isLiked,
    });
  } catch (err) {
    next(err);
  }
};

// 상품 수정 API
export const updateProduct = async (req: AuthRequest & Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const productId = parseInt(req.params.id);
    
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
      select: { userId: true }
    });

    if (!existingProduct) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    if (existingProduct.userId !== req.user!.id) {
      res.status(403).json({ error: '상품을 수정할 권한이 없습니다.' });
      return;
    }

    const updated = await prisma.product.update({
      where: { id: productId },
      data: req.body,
    });
    res.json(updated);
  } catch (err: any) {
    if (err.code === 'P2025') {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    next(err);
  }
};

// 상품 삭제 API
export const deleteProduct = async (req: AuthRequest & Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const productId = parseInt(req.params.id);
    
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
      select: { userId: true }
    });

    if (!existingProduct) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    if (existingProduct.userId !== req.user!.id) {
      res.status(403).json({ error: '상품을 삭제할 권한이 없습니다.' });
      return;
    }

    await prisma.product.delete({ where: { id: productId } });
    res.status(204).send();
  } catch (err: any) {
    if (err.code === 'P2025') {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    next(err);
  }
};

// 상품 좋아요 토글 API
export const toggleProductLike = async (req: AuthRequest & Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const productId = parseInt(req.params.id);
    const userId = req.user!.id;

    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    const existingLike = await prisma.like.findFirst({
      where: { userId, productId }
    });

    if (existingLike) {
      await prisma.like.delete({
        where: { id: existingLike.id }
      });
      res.json({ message: '좋아요가 취소되었습니다.', isLiked: false });
    } else {
      await prisma.like.create({
        data: { userId, productId }
      });
      res.json({ message: '좋아요가 추가되었습니다.', isLiked: true });
    }
  } catch (err) {
    next(err);
  }
};
