import { object, string, number, optional } from 'superstruct';

export const CreateCommentBodyStruct = object({
  content: string(),
  articleId: optional(number()),
  productId: optional(number()),
});

export const UpdateCommentBodyStruct = object({
  content: string(),
});
