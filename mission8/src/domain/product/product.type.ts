export interface UpdatePriceInput {
  userId: number;
  productId: number;
  price: number;
}

export interface ProductProps {
  id: number;
  name: string;
  price: number;
  userId: number;
}
