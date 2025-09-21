export interface ArticleWithCounts {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  userId?: number;
  user?: {
    nickname: string;
  };
  _count: {
    likes: number;
    comments: number;
  };
}

export interface ArticleWithLikeStatus extends Omit<ArticleWithCounts, '_count'> {
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
}