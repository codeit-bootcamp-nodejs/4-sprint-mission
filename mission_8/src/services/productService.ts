import * as productRepository from "../repository/productRepository.js";
import notificationService from "./notificationService.js";
import type {
  CreateProductDTO,
  GetProductsDTO,
  GetProductDTO,
  PatchProductDTO,
  DeleteProductDTO,
  PostCommentDTO,
  GetCommentsDTO,
  PatchCommentDTO,
  DeleteCommentDTO,
} from "../types/product.js";

export async function createProduct(data: CreateProductDTO) {
  const result = await productRepository.createProduct(data);

  return result;
}

export async function getProducts(data: GetProductsDTO) {
  const result = await productRepository.getProducts(data);

  return result;
}

export async function getProduct(data: GetProductDTO) {
  const result = await productRepository.getProduct(data);

  return result;
}

export async function patchProduct(data: PatchProductDTO) {
  const { id, price: newPrice } = data;

  const originalProduct = await productRepository.getProduct({ id: Number(id) });
  if (!originalProduct) {
    throw new Error("상품이 존재하지 않습니다.");
  }
  const oldPrice = originalProduct.price;

  const updatedProduct = await productRepository.patchProduct(data);

  if (newPrice !== undefined && newPrice !== oldPrice) {
    const likedUsers = await productRepository.getLikedUsersByProductId(
      Number(id)
    );

    for (const liked of likedUsers) {
      const message = `'${originalProduct.name}' 상품의 가격이 ${oldPrice}원에서 ${newPrice}원으로 변경되었습니다.`;
      await notificationService.createNotification(
        liked.userId,
        message,
        undefined,
        Number(id)
      );
    }
  }

  return updatedProduct;
}

export async function deleteProduct(data: DeleteProductDTO) {
  const result = await productRepository.deleteProduct(data);

  return result;
}

export async function postComment(data: PostCommentDTO) {
  const result = await productRepository.postComment(data);

  return result;
}

export async function getComments(data: GetCommentsDTO) {
  const result = await productRepository.getComments(data);

  return result;
}

export async function patchComment(data: PatchCommentDTO) {
  const result = await productRepository.patchComment(data);

  return result;
}

export async function deleteComment(data: DeleteCommentDTO) {
  const result = await productRepository.deleteComment(data);

  return result;
}

export async function toggleLike(userId: number, productId: number) {
  const existingLike = await productRepository.findLike(userId, productId);

  if (existingLike) {
    await productRepository.unlikeProduct(userId, productId);
    return { message: '관심 목록에서 삭제했습니다.' };
  } else {
    await productRepository.likeProduct(userId, productId);
    return { message: '관심 목록에 추가했습니다.' };
  }
}
