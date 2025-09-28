import * as productRepository from "../repository/productRepository.js";
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
  const result = await productRepository.patchProduct(data);

  return result;
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
