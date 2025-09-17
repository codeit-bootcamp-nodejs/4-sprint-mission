import { makeValidator } from "../lib/validator.js";
import { registerSchema, loginSchema } from "../schemas/authSchemas.js";

export const validateRegister = makeValidator({ body: registerSchema });
export const validateLogin = makeValidator({ body: loginSchema });
