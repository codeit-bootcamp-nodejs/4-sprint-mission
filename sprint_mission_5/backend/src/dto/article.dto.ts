export interface CreateArticleDto {
  title: string;
  content: string;
  userId: number;
}

export interface UpdateArticleDto {
  title?: string;
  content?: string;
}

export interface ArticleResponseDto {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
}

export interface ArticleWithCountsDto extends ArticleResponseDto {
  likeCount: number;
  commentCount: number;
  user?: {
    nickname: string;
  };
}

export interface ArticleWithLikeStatusDto extends ArticleWithCountsDto {
  isLiked: boolean;
}

export interface ArticleListResponseDto {
  list: ArticleWithLikeStatusDto[];
  totalCount: number;
}

export interface ArticleQueryDto {
  page?: number;
  pageSize?: number;
  orderBy?: 'recent' | 'like';
  keyword?: string;
}