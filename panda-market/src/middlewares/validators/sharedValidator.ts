import { idSchema, getListSchema } from '@/validations/sharedSchema.js';
import createValidator from '@/middlewares/validator.factory.js';

export const validateId = createValidator((req) => {
  req.parsedId = idSchema.parse(req.params);
});

export const validateGetListQuery = createValidator((req) => {
  req.parsedQuery = getListSchema.parse(req.query);
});
