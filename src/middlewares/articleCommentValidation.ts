// middlewares/articleCommentValidation.ts
import {
  ArticleCommentBodySchema,
  ArticleCommentParamsSchema,
  ArticleCommentQuerySchema,
} from "../schemas/articleCommentSchemas.js";
import { makeValidator } from "../lib/validator.js";

// 단일
export const validateArticleCommentBody = makeValidator({
  body: ArticleCommentBodySchema,
});
export const validateArticleCommentParams = makeValidator({
  params: ArticleCommentParamsSchema,
});
export const validateArticleCommentQuery = makeValidator({
  query: ArticleCommentQuerySchema,
});

// 조합
export const validateArticleCommentParamsAndQuery = makeValidator({
  params: ArticleCommentParamsSchema,
  query: ArticleCommentQuerySchema,
});
export const validateArticleCommentBodyAndParams = makeValidator({
  body: ArticleCommentBodySchema,
  params: ArticleCommentParamsSchema,
});
