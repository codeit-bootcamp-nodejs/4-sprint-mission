export interface CommentDTO {
  id?: number;
  name: string;
  title: string;
  type?: "MARKET" | "ARTICLE";
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
  userId: number;
  productId: number;
  articleId: number;
}

export interface CommentQueryDTO {
    id: number;
  take: number;
  page: number;
  type?: "MARKET" | "ARTICLE";
}

export interface CommentPatchDTO {
  id: number;
  name?: string;
  title?: string;
  type?: "MARKET" | "ARTICLE";
  content?: string;
  userId: number;
  productId?: number;
  articleId?: number;
}
