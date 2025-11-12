import prisma from '../../utils/prisma.js';
import { Product } from './product.js';

class ProductRepository {
  findById = async (productId: number) => {
    const data = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!data) {
      return null;
    }
    return new Product(data.id, data.name, data.price, data.userId);
  };
  // 상품 가격 변경
  updatePrice = async (productId: number, price: number) => {
    return await prisma.product.update({
      where: { id: productId },
      data: { price: price },
    });
  };
}

export const productRepository = new ProductRepository();
