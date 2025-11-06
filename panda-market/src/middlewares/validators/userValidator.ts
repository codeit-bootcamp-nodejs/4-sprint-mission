import { patchSchema } from '@/validations/userSchema.js';
import createValidator from '@/middlewares/validator.factory.js';

export const validatePatchUser = createValidator((req) => {
  patchSchema.partial().parse(req.body);
});
