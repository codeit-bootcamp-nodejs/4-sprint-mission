export default interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  tags: string[];
  images: string[];
  userId: number;
  favoriteCount: number;
  isFavorited: boolean;
  createdAt: Date;
  updatedAt: Date;
}
