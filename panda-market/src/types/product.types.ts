export interface ProductId {
  productId: number;
}

export interface BaseProductInput {
  name: string;
  description: string;
  price: number;
  tags: string[];
  imageUrls: string[];
}
