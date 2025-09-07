import { makeValidator } from "../lib/validator.js";
import productSchemas from "../schemas/productSchemas.js";

export const validateProductBody = makeValidator({ body: productSchemas.body });
export const validateProductParams = makeValidator({
  params: productSchemas.params,
});
export const validateProductQuery = makeValidator({
  query: productSchemas.query,
});
