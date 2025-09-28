import { contentSchema, patchSchema } from '../../validations/userSchema.js';
import createValidator from '../validator.factory.js';

export const validateGetUserContent = createValidator((req) => {
  const { content } = contentSchema.parse(req.params);
  req.content = content;
});

export const validatePatchUser = createValidator((req) => {
  patchSchema.partial().parse(req.body);
});
