export interface CreateProductDTO {
  userId: number;
  name: string;
  description: string;
  price: number;
  tags: string[];
}

export interface GetProductsDTO {
  offset: number;
  limit: number;
  sort: "asc" | "desc";
  search: string;
}

export interface GetProductDTO {
  id: number;
}

export interface PatchProductDTO {
  id: number;
  name?: string;
  description?: string;
  price?: number;
  tags?: string[];
}

export interface DeleteProductDTO {
  id: number;
}

export interface PostCommentDTO {
  pid: number;
  userId: number;
  content: string;
  name: string;
}

export interface GetCommentsDTO {
  pid: number;
  cursor: number | null;
  limit: number;
}

export interface GetCommentDTO {
  cid: number;
}

export interface PatchCommentDTO {
  cid: number;
  name: string;
  content: string;
}

export interface DeleteCommentDTO {
  cid: number;
}

export interface GetProductsByUserDTO {
  userId: number;
  offset?: number;
  limit?: number;
}
