import prisma from '../../utils/prisma.js';
import { Product } from './product.js';
import type { UpdatePriceInput } from './product.type.js';

class ProductRepository {
  findById = async (productId: number) => {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      return null;
    }
    return new Product(product);
  };
  // 상품 가격 변경
  updatePrice = async (updateData: UpdatePriceInput) => {
    return await prisma.product.update({
      where: { id: updateData.productId, userId: updateData.userId },
      data: { price: updateData.price },
    });
  };
}

export const productRepository = new ProductRepository();
