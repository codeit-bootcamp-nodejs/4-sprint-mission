interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  tags: string[];
  images: string[];
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  favoriteCount: number;
  isFavorited?: boolean;
}

export default Product;
