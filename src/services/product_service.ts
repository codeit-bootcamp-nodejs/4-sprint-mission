// src/services/product_service.ts
import { prisma } from '../lib/prisma';

class ProductService {
  async getProducts() {
    return await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { likes: true } } },
    });
  }

  async getProductById(id: number) {
    return await prisma.product.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, nickname: true, email: true } },
        _count: { select: { likes: true } },
      },
    });
  }

  async createProduct(data: {
    title: string;
    description: string;
    price: number;
    ownerId: number;
    tags?: string[];
    imageUrl?: string;
  }) {
    return await prisma.product.create({
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        ownerId: data.ownerId,
        tags: data.tags || [],
        imageUrl: data.imageUrl,
      },
    });
  }

  async updateProduct(id: number, data: {
    title?: string;
    description?: string;
    price?: number;
    tags?: string[];
    imageUrl?: string;
  }) {
    return await prisma.product.update({ where: { id }, data });
  }

  async deleteProduct(id: number) {
    return await prisma.product.delete({ where: { id } });
  }
}

export default new ProductService();