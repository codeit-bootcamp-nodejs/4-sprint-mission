import prisma from '../prismaClient.js';

const productService = {
  async createProduct(data) {
    const newProduct = await prisma.product.create({
      data,
    });
    return newProduct;
  },

  async getProductById(id) {
    const product = await prisma.product.findFirst({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        tags: true,
        createdAt: true,
      },
    });
    return product;
  },

  async updateProduct(id, data) {
    const productPatched = await prisma.product.update({
      where: { id },
      data,
    });
    return productPatched;
  },

  async deleteProduct(id) {
    const product = await prisma.product.delete({
      where: { id },
    });
    return product;
  },

  async listProduct({ page, pageSize, keyword }) {
    const where = keyword
      ? {
          OR: [
            { name: { contains: keyword, mode: 'insensitive' } },
            { description: { contains: keyword, mode: 'insensitive' } },
          ],
        }
      : {};
    const products = await prisma.product.findMany({
      where,
      select: {
        id: true,
        name: true,
        price: true,
        createdAt: true,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    });
    return products;
  },
};

export default productService;
