export interface ProductWithCounts {
  id: number;
  name: string;
  price: number;
  createdAt: Date;
  userId?: number;
  description?: string;
  tags?: string[];
  imageUrl?: string;
  _count: {
    likes: number;
    comments: number;
  };
}

export interface ProductWithLikeStatus extends Omit<ProductWithCounts, '_count'> {
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
}