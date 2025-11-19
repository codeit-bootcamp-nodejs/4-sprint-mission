import * as z from 'zod';

// prettier-ignore
export const postSchema = z.object({
  title: z.string().min(1, "제목을 입력해 주세요."),
  content: z.string().min(1, "내용을 입력해 주세요."),
  imageUrls: z.array(z.string()).optional(),
}).strict()
