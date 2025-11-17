//src/controllers/product_controller.ts
import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import notificationService from '../services/notification_service';

class ProductController {
  async getProducts(req: Request, res: Response) {
    try {
      const products = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { likes: true } } },
      });
      res.status(200).json(products);
    } catch (error) {
      console.error('상품 목록 조회 오류:', error);
      res.status(500).json({ error: '상품 목록 조회에 실패했습니다.' });
    }
  }

  async getProductById(req: Request, res: Response) {
    try {
      const productId = parseInt(req.params.id);
      const product = await prisma.product.findUnique({
        where: { id: productId },
        include: {
          owner: { select: { id: true, nickname: true, email: true } },
          _count: { select: { likes: true } },
        },
      });

      if (!product) {
        return res.status(404).json({ error: '상품을 찾을 수 없습니다.' });
      }

      res.status(200).json(product);
    } catch (error) {
      console.error('상품 조회 오류:', error);
      res.status(500).json({ error: '상품 조회에 실패했습니다.' });
    }
  }

  async createProduct(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { title, description, price, tags, imageUrl } = req.body;

      if (!title || !description || price === undefined) {
        return res.status(400).json({ error: '필수 필드를 입력해주세요.' });
      }

      const product = await prisma.product.create({
        data: {
          title,
          description,
          price: Number(price),
          tags: tags || [],
          imageUrl: imageUrl || null,
          ownerId: userId,
        },
      });

      res.status(201).json(product);
    } catch (error) {
      console.error('상품 생성 오류:', error);
      res.status(500).json({ error: '상품 생성에 실패했습니다.' });
    }
  }

  async updateProduct(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const productId = parseInt(req.params.id);
      const { title, description, price, tags, imageUrl } = req.body;

      const existingProduct = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!existingProduct) {
        return res.status(404).json({ error: '상품을 찾을 수 없습니다.' });
      }
      if (existingProduct.ownerId !== userId) {
        return res.status(403).json({ error: '수정 권한이 없습니다.' });
      }

      const updatedProduct = await prisma.product.update({
        where: { id: productId },
        data: {
          ...(title && { title }),
          ...(description && { description }),
          ...(price !== undefined && { price: Number(price) }),
          ...(tags && { tags }),
          ...(imageUrl !== undefined && { imageUrl }),
        },
      });

      if (price !== undefined && Number(price) !== existingProduct.price) {
        await notificationService.notifyPriceChange(
          productId,
          existingProduct.price,
          Number(price)
        );
      }

      res.status(200).json(updatedProduct);
    } catch (error) {
      console.error('상품 수정 오류:', error);
      res.status(500).json({ error: '상품 수정에 실패했습니다.' });
    }
  }

  async deleteProduct(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const productId = parseInt(req.params.id);

      const existingProduct = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!existingProduct) {
        return res.status(404).json({ error: '상품을 찾을 수 없습니다.' });
      }
      if (existingProduct.ownerId !== userId) {
        return res.status(403).json({ error: '삭제 권한이 없습니다.' });
      }

      await prisma.product.delete({ where: { id: productId } });
      res.status(204).send();
    } catch (error) {
      console.error('상품 삭제 오류:', error);
      res.status(500).json({ error: '상품 삭제에 실패했습니다.' });
    }
  }

  async likeProduct(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const productId = parseInt(req.params.id);

      const existing = await prisma.productLike.findUnique({
        where: {
          userId_productId: { userId, productId },
        },
      });

      if (existing) {
        return res.status(400).json({ error: '이미 좋아요한 상품입니다.' });
      }

      await prisma.productLike.create({
        data: { userId, productId },
      });

      res.status(200).json({ message: '좋아요가 추가되었습니다.' });
    } catch (error) {
      console.error('좋아요 추가 오류:', error);
      res.status(500).json({ error: '좋아요 추가에 실패했습니다.' });
    }
  }
}

export default new ProductController();