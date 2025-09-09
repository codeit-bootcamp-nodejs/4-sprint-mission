import { imageSchema } from '../../validations/fileSchema.js';
import createValidator from '../validator.factory.js';

export const validatePostFile = createValidator((req) => {
  imageSchema.parse(req.file);
});
