import {
  ArticleBodySchema,
  ArticleParamsSchema,
  ArticleQuerySchema,
} from "../schemas/articleSchemas.js";
import { makeValidator } from "../lib/validator.js";

export const validateArticleBody = makeValidator({
  body: ArticleBodySchema,
});

export const validateArticleParams = makeValidator({
  params: ArticleParamsSchema,
});

export const validateArticleQuery = makeValidator({
  query: ArticleQuerySchema,
});

export const validateArticleBodyAndParams = makeValidator({
  body: ArticleBodySchema,
  params: ArticleParamsSchema,
});
