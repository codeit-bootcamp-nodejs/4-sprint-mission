import * as z from "zod";

// prettier-ignore
export const postSchema = z.object({
  content: z.string().min(1, "내용을 입력해주세요"),
}).strict();

export const getCommentListSchema = z.object({
  cursorId: z.coerce.number().int().catch(null),
  page: z.coerce.number().int().catch(0),
  pageSize: z.coerce.number().int().catch(10),
});
