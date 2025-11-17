import type { Comment } from "@prisma/client";

export interface ArticleQueryDTO {
  page: number;
  take: number;
  title?: string;
  content?: string;
  keyword: string;
}

export interface ArticleDTO {
  id?: number;
  title: string | null;
  content: string;
  createdAt: Date;
  ownerId: number;
  comments: Comment[];
}

export interface PatchArticleDTO {
  title?: string | null;
  content?: string;
  createdAt?: Date;
  ownerId: number;
}
