import { makeValidator } from "../lib/validator.js";
import productCommentSchemas from "../schemas/productCommentSchemas.js";

export const validateProductCommentBody = makeValidator({
  body: productCommentSchemas.body,
});
export const validateProductCommentParams = makeValidator({
  params: productCommentSchemas.params,
});
export const validateProductCommentQuery = makeValidator({
  query: productCommentSchemas.query,
});
