import {
  UpdateProfileBodySchema,
  ChangePasswordBodySchema,
} from "../schemas/userSchemas.js";

import { makeValidator } from "../lib/validator.js";

export const validateUpdateProfileBody = makeValidator({
  body: UpdateProfileBodySchema,
});

export const validateChangePasswordBody = makeValidator({
  body: ChangePasswordBodySchema,
});
