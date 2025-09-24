import type { Controller } from "../controller.js";
import type {
  ArticleBodyDto,
  ArticleParamsDto,
  ArticleQueryDto,
} from "../../dto/request/article.request.dto.js";

export type CreateArticleController = Controller<
  unknown,
  unknown,
  ArticleBodyDto
>;

export type GetArticleByIdController = Controller<ArticleParamsDto>;

export type UpdateArticleController = Controller<
  ArticleParamsDto,
  unknown,
  ArticleBodyDto
>;

export type DeleteArticleController = Controller<ArticleParamsDto>;

export type ListArticleController = Controller<
  unknown,
  unknown,
  unknown,
  ArticleQueryDto
>;

export type ToggleArticleLikeController = Controller<ArticleParamsDto>;
