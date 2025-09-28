import { postSchema } from '../../validations/productSchema.js';
import createValidator from '../validator.factory.js';

export const validatePostBody = createValidator((req) => {
  postSchema.parse(req.body);
});
export const validatePatchBody = createValidator((req) => {
  postSchema.partial().parse(req.body);
});
