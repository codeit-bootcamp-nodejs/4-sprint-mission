import { makeValidator } from "../lib/validator.js";
import articleCommentSchemas from "../schemas/articleCommentSchemas.js";

export const validateArticleCommentBody = makeValidator({
  body: articleCommentSchemas.body,
});
export const validateArticleCommentParams = makeValidator({
  params: articleCommentSchemas.params,
});
export const validateArticleCommentQuery = makeValidator({
  query: articleCommentSchemas.query,
});
