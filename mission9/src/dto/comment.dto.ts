export interface CommentDTO {
  id?: number;
  title: string;
  type: "MARKET" | "ARTICLE";
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
  ownerId: number;
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
  title?: string;
  type?: "MARKET" | "ARTICLE";
  content?: string;
  ownerId: number;
  productId?: number;
  articleId?: number;
}


export interface CommentCreateDTO {
  id: number;
  title: string;
  type: "MARKET" | "ARTICLE";
  content: string;
  createdAt: Date;
  updatedAt: Date;
  ownerId: number;
  productId: number ;
  articleId: number;
}