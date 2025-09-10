export interface CreateCommentData {
  content: string;
  productId?: number;
  articleId?: number;
  userId: number;
}

export interface UpdateCommentData {
  content?: string;
}

export type FindManyCommentParams = {
  productId?: number;
  articleId?: number;
  cursor?: string;
  limit: number;
};
