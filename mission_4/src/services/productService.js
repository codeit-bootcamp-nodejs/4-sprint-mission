import * as productRepository from "../repository/productRepository.js";

export async function createProduct(data) {
  const result = await productRepository.createProduct(data);

  return result;
}

export async function getProducts(data) {
  const result = await productRepository.getProducts(data);

  return result;
}

export async function getProduct(data) {
  const result = await productRepository.getProduct(data);

  return result;
}

export async function patchProduct(data) {
  const result = await productRepository.patchProduct(data);

  return result;
}

export async function deleteProduct(data) {
  const result = await productRepository.deleteProduct(data);

  return result;
}

export async function postComment(data) {
  const result = await productRepository.postComment(data);

  return result;
}

export async function getComments(data) {
  const result = await productRepository.getComments(data);

  return result;
}

export async function patchComment(data) {
  const result = await productRepository.patchComment(data);

  return result;
}

export async function deleteComment(data) {
  const result = await productRepository.deleteComment(data);

  return result;
}
