import {
  ProductBodySchema,
  ProductParamsSchema,
  ProductQuerySchema,
} from "../schemas/productSchemas.js";

import { makeValidator } from "../lib/validator.js";

export const validateProductBody = makeValidator({
  body: ProductBodySchema,
});

export const validateProductParams = makeValidator({
  params: ProductParamsSchema,
});

export const validateProductQuery = makeValidator({
  query: ProductQuerySchema,
});

export const validateProductBodyAndParams = makeValidator({
  body: ProductBodySchema,
  params: ProductParamsSchema,
});
