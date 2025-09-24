import type { ArticleComment } from "@prisma/client";
import type {
  listArticleCommentDto,
  getArticleCommentByIdDto,
  createArticleCommentDto,
  updateArticleCommentDto,
  deleteArticleCommentDto,
} from "../../dto/service/article-comment.service.dto.js";

/** CREATE */
export type CreateArticleCommentInput = createArticleCommentDto;
export type CreateArticleCommentResult = ArticleComment;

/** UPDATE */
export type UpdateArticleCommentInput = updateArticleCommentDto;
export type UpdateArticleCommentResult = ArticleComment;

/** DELETE */
export type DeleteArticleCommentInput = deleteArticleCommentDto;
export type DeleteArticleCommentResult = ArticleComment;

/** LIST */
export type ListArticleCommentInput = listArticleCommentDto;
export type ListArticleCommentResult = ArticleComment[];

/** GET by ID */
export type GetArticleCommentByIdInput = getArticleCommentByIdDto;
export type GetArticleCommentByIdResult =
  | (ArticleComment & { User: { id: number; nickname: string } | null })
  | null;
