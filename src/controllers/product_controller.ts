// src/controllers/product_controller.ts
import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import notificationService from '../services/notification_service';

class ProductController {
    async updateProduct(req: Request, res: Response) {
        try {
            const userId = req.user?.id || parseInt(req.body.userId);
            const productId = parseInt(req.params.id);
            const { name, description, price, tags } = req.body;

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
                    ...(name && { name }),
                    ...(description && { description }),
                    ...(price && { price: parseInt(price) }),
                    ...(tags && { tags }),
                },
            });

            if (price && parseInt(price) !== existingProduct.price) {
                await notificationService.notifyPriceChange(
                    productId,
                    existingProduct.price,
                    parseInt(price)
                );
            }

            res.status(200).json(updatedProduct);
        } catch (error: any) {
            console.error('상품 수정 실패:', error);
            res.status(500).json({ error: '상품 수정에 실패했습니다.' });
        }
    }

    async likeProduct(req: Request, res: Response) {
        try {
            const userId = req.user?.id || parseInt(req.body.userId); // 테스트용
            const productId = parseInt(req.params.id);

            const product = await prisma.product.findUnique({
                where: { id: productId },
            });

            if (!product) {
                return res.status(404).json({ error: '상품을 찾을 수 없습니다.' });
            }

            const existingLike = await prisma.productLike.findUnique({
                where: {
                    userId_productId: {
                        userId,
                        productId,
                    },
                },
            });

            if (existingLike) {
                await prisma.productLike.delete({
                    where: {
                        userId_productId: {
                            userId,
                            productId,
                        },
                    },
                });

                res.status(200).json({ message: '좋아요가 취소되었습니다.', isLiked: false });
            } else {
                await prisma.productLike.create({
                    data: {
                        userId,
                        productId,
                    },
                });

                res.status(201).json({ message: '좋아요가 등록되었습니다.', isLiked: true });
            }
        } catch (error: any) {
            console.error('좋아요 처리 실패:', error);
            res.status(500).json({ error: '좋아요 처리에 실패했습니다.' });
        }
    }
}

export default new ProductController();