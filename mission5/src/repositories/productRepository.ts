import prisma from "../lib/prisma";
import { Prisma } from "@prisma/client";
import { ProductCreateDTO, ProductUpdateDTO, ProductQueryDTO } from "../dtos/product.dto";

export class ProductRepository {
  async createProduct(data: { userId: number; name: string; description: string; price: number; tags: string }) {
    return prisma.product.create({ data });
  }

  async findMany(where: Prisma.ProductWhereInput, skip: number, take: number) {
    return prisma.product.findMany({
      skip,
      take,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        tags: true,
        createdAt: true,
      },
      where,
    });
  }

  async findById(id: number) {
    return prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        name: true,
        description: true,
        price: true,
        tags: true,
        createdAt: true,
      },
    });
  }

  async updateProduct(id: number, data: Partial<{ name: string; description: string; price: number; tags: string }>) {
    return prisma.product.update({ where: { id }, data });
  }

  async deleteProduct(id: number) {
    return prisma.product.delete({ where: { id } });
  }
}