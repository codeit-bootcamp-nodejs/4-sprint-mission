export default interface Comment {
  id: number;
  content: string;
  userId: number;
  productId: number | null;
  articleId: number | null;
  createdAt: Date;
  updatedAt: Date;
}
