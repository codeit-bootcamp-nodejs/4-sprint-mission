import prisma from "../utils/prisma";
import { Prisma } from "@prisma/client";
import { CreateProductDto, UpdateProductDto } from "../dtos/product.dto";

export class ProductService {
  async createProduct(userId: number, dto: CreateProductDto) {
    return prisma.product.create({
      data: { ...dto, userId },
    });
  }

  async getProductById(id: number, userId?: number) {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return null;

    let isLiked = false;
    if (userId) {
      const like = await prisma.like.findUnique({
        where: { userId_productId: { userId, productId: id } },
      });
      isLiked = !!like;
    }

    return { ...product, isLiked };
  }

  async updateProduct(id: number, userId: number, dto: UpdateProductDto) {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return null;
    if (product.userId !== userId) throw new Error("FORBIDDEN");

    return prisma.product.update({
      where: { id },
      data: dto,
    });
  }

  async deleteProduct(id: number, userId: number) {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return null;
    if (product.userId !== userId) throw new Error("FORBIDDEN");

    await prisma.product.delete({ where: { id } });
    return true;
  }

  async getProducts(page: number, pageSize: number, sort: "recent" | "asc", search: string) {
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  const where: Prisma.ProductWhereInput = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      }
    : {};

  const products = await prisma.product.findMany({
    where,
    orderBy: { createdAt: sort === "recent" ? "desc" : "asc" },
    skip,
    take,
    select: { id: true, name: true, price: true, createdAt: true },
  });

  const total = await prisma.product.count({ where });

  return {
    data: products,
    pagination: {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
  };
}
}
