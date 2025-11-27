import * as productRepository from '../repositories/productRepository';

export async function createProduct(data: {
  name: string;
  description: string;
  price: number;
  tags: string[];
  userId: number;
}) {
  return productRepository.createProduct(data);
}

export async function getProducts(params: {
  page?: number;
  pageSize?: number;
  keyword?: string;
  sortBy?: string;
}) {
  return productRepository.getProducts(params);
}

export async function getProductById(id: number) {
  const product = await productRepository.getProductById(id);
  if (!product) {
    throw new Error('Product not found');
  }
  return product;
}

export async function updateProduct(
  id: number,
  userId: number,
  data: {
    name?: string;
    description?: string;
    price?: number;
    tags?: string[];
  }
) {
  const product = await productRepository.getProductById(id);
  if (!product) {
    throw new Error('Product not found');
  }
  if (product.userId !== userId) {
    throw new Error('You are not authorized to update this product');
  }

  return productRepository.updateProduct(id, data);
}

export async function deleteProduct(id: number, userId: number) {
  const product = await productRepository.getProductById(id);
  if (!product) {
    throw new Error('Product not found');
  }
  if (product.userId !== userId) {
    throw new Error('You are not authorized to delete this product');
  }

  return productRepository.deleteProduct(id);
}
