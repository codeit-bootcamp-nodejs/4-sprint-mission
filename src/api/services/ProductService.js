import prisma from "../prismaClient.js";

const ProductService = {
  async createProduct(productData, userId) {
    const newProduct = await prisma.product.create({
      data: { ...productData, userId },
    });
    return newProduct;
  },

  async findUniqueProduct(productId, userId) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!userId) {
      return { ...product, isLiked: false };
    }

    const like = await prisma.like.findFirst({
      where: { userId, productId },
    });
    return { ...product, isLiked: !!like };
  },

  async patchProduct(id, updateData, userId) {
    const product = await prisma.product.findUnique({ where: { id } });

    if (product.userId != userId) {
      const error = new Error("상품을 수정할 권한이 없습니다.");
      error.statusCode = 403;
      throw error;
    }
    return await prisma.product.update({
      where: { id },
      data: updateData,
    });
  },

  async deleteProduct(id, userId) {
    const product = await prisma.product.findUnique({ where: { id } });

    if (product.userId !== userId) {
      const error = new Error("상품을 삭제할 권한이 없습니다.");
      error.statusCode = 403;
      throw error;
    }
    return await prisma.product.delete({
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
