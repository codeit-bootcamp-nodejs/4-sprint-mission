import { nonempty, number, object, optional, string } from 'superstruct';
import { CursorParamsStruct } from './commonStructs';

export const CreateCommentBodyStruct = object({
  content: nonempty(string()),
  productId: optional(number()),
  articleId: optional(number()),
});

export const GetCommentListParamsStruct = CursorParamsStruct;

export const UpdateCommentBodyStruct = CreateCommentBodyStruct;
