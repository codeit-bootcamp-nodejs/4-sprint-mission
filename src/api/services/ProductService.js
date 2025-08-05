import prisma from "../prismaClient.js";

const ProductService = {
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

  async findManyProduct({ offset, limit, order, keyword }) {
    let orderBy;
    switch (order) {
      case "oldest":
        orderBy = { createdAt: "asc" };
        break;
      case "recent":
      default:
        orderBy = { createdAt: "desc" };
    }

    let where = {};
    if (keyword) {
      where = {
        OR: [
          { name: { contains: keyword, mode: "insensitive" } },
          { description: { contains: keyword, mode: "insensitive" } },
        ],
      };
    }

    const products = await prisma.product.findMany({
      select: { id: true, name: true, price: true, createdAt: true },
      skip: parseInt(offset),
      take: parseInt(limit),
      orderBy,
      where,
    });

    return products;
  },
};

export default ProductService;
