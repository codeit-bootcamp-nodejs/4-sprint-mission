import { postSchema } from '../../validations/commentSchema.js';
import { getCommentListSchema } from '../../validations/commentSchema.js';
import createValidator from '../validator.factory.js';

export const validateGetListQuery = createValidator((req) => {
  req.parsedCursorQuery = getCommentListSchema.parse(req.query);
});

export const validatePostBody = createValidator((req) => {
  postSchema.parse(req.body);
});

export const validatePatchBody = createValidator((req) => {
  postSchema.partial().parse(req.body);
});
