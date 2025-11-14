import { ProductRepository } from "../repositories/productRepository";
import { LikeRepository } from "../repositories/likeRepository";
import { AlertService } from "../services/alertService";
import type { ProductCreateDTO, ProductQueryDTO } from "../dtos/product.dto";
import type { Prisma } from "@prisma/client";

export class ProductService {
  private repo = new ProductRepository();
  private likeRepo = new LikeRepository();
  private alertService = new AlertService();

  async create(userId: number, data: ProductCreateDTO) {
    return this.repo.createProduct({ ...data, userId });
  }

  async list({ page, pageSize, keyword }: ProductQueryDTO) {
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

  async update(
    userId: number,
    productId: number,
    data: { name?: string; description?: string; price?: number; tags?: string }
  ) {
    const product = await this.repo.findById(productId);
    if (!product) throw new Error("NOT_FOUND");
    if (product.userId !== userId) throw new Error("FORBIDDEN");

    const oldPrice = product.price;
    const updated = await this.repo.updateProduct(productId, data);

    if (data.price !== undefined && data.price !== oldPrice) {
      const likedUsers = await this.likeRepo.findUsersWhoLikedProduct(productId);
      
      const targetUsers = likedUsers.filter((u) => u.id !== userId);

      for (const user of targetUsers) {
        await this.alertService.create(
          user.id,
          `좋아요한 상품 "${updated.name}"의 가격이 ${oldPrice}원 → ${data.price}원으로 변경되었습니다.`,
          `/products/${productId}`
        );
      }
    }

    return updated;
  }

  async delete(userId: number, productId: number) {
    const product = await this.repo.findById(productId);
    if (!product) throw new Error("NOT_FOUND");
    if (product.userId !== userId) throw new Error("FORBIDDEN");

    await this.repo.deleteProduct(productId);
  }
}
