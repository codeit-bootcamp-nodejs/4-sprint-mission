import * as productRepo from "../repository/product_repository";
import { createNotificationService } from "./notification_service";
import { AppError } from "../utils/error";

export async function createProductService({ data, user }: Product.Create) {
  const product = await productRepo.createProductRepo({ data, user });
  return product;
}

export async function deleteProductService({ id, user }: Product.Delete) {
  const product = await productRepo.findUniqueProduct(id);
  if (!product) throw new AppError("존재하지 않는 상품입니다.", 404);
  if (product.userId !== user.id) throw new AppError("권한이 없습니다.", 403);
  await productRepo.deleteProduct(id);
}

export async function getProductByIdService({ id, user }: Product.Delete) {
  const product = await productRepo.getProductByIdRepo(id);
  if (!product) {
    throw new AppError("존재하지 않는 상품입니다.", 404);
  }
  const { _count, like, ...rest } = product;
  return {
    ...rest,
    likeCount: _count.like,
    isLiked: !!user.id && like.some((l) => l.userId === user.id),
  };
}

export async function getProductService({
  offset,
  limit,
  search,
  user,
}: Article.Get) {
  const products = await productRepo.getProductRepo(offset, limit, search);
  return products.map(({ _count, like, ...rest }) => ({
    ...rest,
    likeCount: _count.like,
    isLiked: !!user.id && like.some((l) => l.userId === user.id),
  }));
}

export async function updateProductService({
  id,
  updateData,
  user,
}: Product.Update) {
  const product = await productRepo.findUniqueProduct(id);
  if (!product) throw new AppError("존재하지 않는 상품입니다.", 404);
  if (product.userId !== user.id) throw new AppError("권한이 없습니다.", 403);
  const updatedProduct = await productRepo.updateProduct({
    id,
    updateData,
    user,
  });

  // 가격 변화있을 때
  if (updateData.price !== undefined && updateData.price !== product.price) {
    const likedUsers = await productRepo.findUserLikedProduct(id);
    if (likedUsers && likedUsers.length > 0) {
      const message = `좋아요한 상품 '${product.name}'의 가격이 ${updateData.price}원으로 변경되었습니다.`;
      for (const { user } of likedUsers) {
        await createNotificationService(user!.id, message);
      }
    }
  }
  return updatedProduct;
}
