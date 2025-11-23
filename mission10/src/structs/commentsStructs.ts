import { nonempty, object, partial, string, integer } from 'superstruct';
import { CursorParamsStruct } from './commonStructs';

export const CreateCommentBodyStruct = object({
  postId: integer(),
  content: nonempty(string()),
});

export const GetCommentListParamsStruct = CursorParamsStruct;

export const UpdateCommentBodyStruct = partial(CreateCommentBodyStruct);
