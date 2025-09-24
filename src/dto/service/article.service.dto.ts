export interface listArticleDto {
  page?: number;
  pageSize?: number;
  keyword?: string[];
}

export interface getArticleByIdDto {
  id: number;
}

export interface createArticleDto {
  title: string;
  content: string;
}

export interface updateArticleDto {
  title: string;
  content: string;
  id: number;
}

export interface deleteArticleDto {
  id: number;
}

export interface toggleArticleLikeDto {
  userId: number;
  id: number;
}
