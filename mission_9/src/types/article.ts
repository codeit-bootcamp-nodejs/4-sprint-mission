export interface CreatePostDTO {
  title: string;
  content: string;
  userId: number;
}

export interface GetPostsDTO {
  cursor?: number;
  limit: number;
  sort: "asc" | "desc";
  offset: number;
  search?: string;
}

export interface GetPostDTO {
  id: number;
}

export interface PatchPostDTO {
  id: number;
  title?: string;
  content?: string;
}

export interface DeletePostDTO {
  id: number;
}

export interface PostCommentDTO {
  pid: number;
  name: string;
  content: string;
  userId: number;
}

export interface GetCommentsDTO {
  pid: number;
  cursor: number;
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
