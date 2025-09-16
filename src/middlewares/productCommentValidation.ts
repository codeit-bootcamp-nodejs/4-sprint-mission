import {
  ProductCommentBodySchema,
  ProductCommentParamsSchema,
  ProductCommentQuerySchema,
} from "../schemas/productCommentSchemas.js";

import { makeValidator } from "../lib/validator.js";

export const validateProductCommentParams = makeValidator({
  params: ProductCommentParamsSchema,
});

export const validateProductCommentBody = makeValidator({
  body: ProductCommentBodySchema,
});

export const validateProductCommentQuery = makeValidator({
  query: ProductCommentQuerySchema,
});

export const validateProductCommentParamsAndQuery = makeValidator({
  params: ProductCommentParamsSchema,
  query: ProductCommentQuerySchema,
});

export const validateProductCommentBodyAndParams = makeValidator({
  params: ProductCommentParamsSchema,
  body: ProductCommentBodySchema,
});
