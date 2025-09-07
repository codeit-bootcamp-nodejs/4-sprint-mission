import { makeValidator } from "../lib/validator.js";
import articleSchemas from "../schemas/articleSchemas.js";

export const validateArticleBody = makeValidator({ body: articleSchemas.body });
export const validateArticleParams = makeValidator({
  params: articleSchemas.params,
});
export const validateArticleQuery = makeValidator({
  query: articleSchemas.query,
});
