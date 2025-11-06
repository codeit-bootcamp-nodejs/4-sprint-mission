import { signupSchema } from '@/validations/authSchema.js';
import createValidator from '@/middlewares/validator.factory.js';

export const validateSignupBody = createValidator((req) => {
  signupSchema.parse(req.body);
});

export const validateLoginBody = createValidator((req) => {
  signupSchema.partial().parse(req.body);
});
