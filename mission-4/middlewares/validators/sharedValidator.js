import { idSchema, getListSchema } from '../../validations/commonSchema.js';
import createValidator from '../validator.factory.js';

export const validateId = createValidator((req) => {
  req.parsedId = idSchema.parse(req.params);
});

export const validateGetListQuery = createValidator((req) => {
  req.parsedQuery = getListSchema.parse(req.query);
});
