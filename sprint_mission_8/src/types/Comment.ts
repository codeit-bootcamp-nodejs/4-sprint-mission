interface Comment {
  id: number;
  content: string;
  userId: number;
  articleId: number | null;
  productId: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export default Comment;
