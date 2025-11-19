interface Article {
  id: number;
  title: string;
  content: string;
  image: string | null;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  likeCount: number;
  isLiked?: boolean;
}

export default Article;
