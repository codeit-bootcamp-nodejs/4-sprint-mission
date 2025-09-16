import type { Article, ArticleLike } from "@prisma/client";
import type {
  listArticleDto,
  getArticleByIdDto,
  createArticleDto,
  updateArticleDto,
  deleteArticleDto,
  toggleArticleLikeDto,
} from "../../dto/service/article.service.dto.js";

/** CREATE */
export type CreateArticleInput = createArticleDto;
export type CreateArticleResult = Article;

/** GET by ID */
export type GetArticleByIdInput = getArticleByIdDto;
export type GetArticleByIdResult =
  | (Article & {
      User: { id: number; nickname: string } | null;
      articleLikes: { userId: number }[];
      _count: { articleLikes: number };
    })
  | null;

/** UPDATE */
export type UpdateArticleInput = updateArticleDto;
export type UpdateArticleResult = Article;

/** DELETE */
export type DeleteArticleInput = deleteArticleDto;
export type DeleteArticleResult = Article;

/** LIST */
export type ListArticleInput = listArticleDto;
export interface ListArticleResult {
  data: Article[];
  total: number;
  page: number;
  pageSize: number;
}

/** LIKE */
export type ToggleArticleLikeInput = toggleArticleLikeDto;
export type ToggleArticleLikeResult = {
  isLiked: boolean;
  likeCount: number;
};
