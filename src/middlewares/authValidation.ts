import { makeValidator } from "../lib/validator.js";
import { RegisterBodySchema, LoginBodySchema } from "../schemas/authSchemas.js";

export const validateRegisterBody = makeValidator({ body: RegisterBodySchema });
export const validateLoginBody = makeValidator({ body: LoginBodySchema });
