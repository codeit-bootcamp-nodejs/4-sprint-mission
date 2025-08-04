import prisma from "../prismaClient.js";

const ProductDbService = {
  async createProduct(productData) {
    const newProduct = await prisma.product.create({
      data: productData,
    });
    return newProduct;
  },

  async findUniqueProduct(id) {
    const product = await prisma.product.findUnique({
      where: { id },
    });
    return product;
  },

  async patchProduct(id, updateData) {
    const product = await prisma.product.update({
      where: { id },
      data: updateData,
    });
    return product;
  },

  async deleteProduct(id) {
    await prisma.product.delete({
      where: { id },
    });
  },

  async findManyProduct() {
    const products = await prisma.product.findMany({
      take: 10,
    });
    return products;
  },
};

export default ProductDbService;
