import { makeValidator } from "../lib/validator.js";
import {
  updateProfileBody,
  changePasswordBody,
} from "../schemas/userSchemas.js";

export const validateUpdateProfile = makeValidator({ body: updateProfileBody });
export const validateChangePassword = makeValidator({
  body: changePasswordBody,
});
