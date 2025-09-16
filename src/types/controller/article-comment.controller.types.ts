import type { Controller } from "../controller.js";
import type {
  ArticleCommentBodyDto,
  ArticleCommentParamsDto,
  ArticleCommentQueryDto,
} from "../../dto/request/article-comment.request.dto.js";

export type CreateArticleCommentController = Controller<
  ArticleCommentParamsDto,
  unknown,
  ArticleCommentBodyDto
>;

export type UpdateArticleCommentController = Controller<
  ArticleCommentParamsDto,
  unknown,
  ArticleCommentBodyDto
>;

export type DeleteArticleCommentController =
  Controller<ArticleCommentParamsDto>;

export type ListArticleCommentController = Controller<
  ArticleCommentParamsDto,
  unknown,
  unknown,
  ArticleCommentQueryDto
>;

export type GetArticleCommentByIdController =
  Controller<ArticleCommentParamsDto>;
