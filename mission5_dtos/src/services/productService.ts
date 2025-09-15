import { ProductRepository } from "../repositories/productRepository";
import type { Prisma } from "@prisma/client";

export class ProductService {
  private repo = new ProductRepository();

  async create(userId: number, data: { name: string; description: string; price: number; tags: string }) {
    return this.repo.createProduct({ ...data, userId });
  }

  async list(page: number, pageSize: number, keyword: string) {
    const where: Prisma.ProductWhereInput = keyword
      ? {
          OR: [
            { name: { contains: keyword, mode: "insensitive" } },
            { description: { contains: keyword, mode: "insensitive" } },
          ],
        }
      : {};
    return this.repo.findMany(where, (page - 1) * pageSize, pageSize);
  }

  async getDetail(id: number) {
    return this.repo.findById(id);
  }

  async update(userId: number, productId: number, data: { name?: string; description?: string; price?: number; tags?: string; }) {
    const product = await this.repo.findById(productId);
    if (!product) throw new Error("NOT_FOUND");
    if (product.userId !== userId) throw new Error("FORBIDDEN");

    return this.repo.updateProduct(productId, data);
  }

  async delete(userId: number, productId: number) {
    const product = await this.repo.findById(productId);
    if (!product) throw new Error("NOT_FOUND");
    if (product.userId !== userId) throw new Error("FORBIDDEN");

    await this.repo.deleteProduct(productId);
  }
}