import * as z from 'zod';

// prettier-ignore
export const postSchema = z.object({
  name: z.string().min(1, "상품 이름을 입력해주세요"),
  description: z.string().min(1, "상품 설명을 입력해주세요"),
  price: z.number(),
  tags: z.array(z.string()).min(1, "태그를 하나 이상 입력해주세요"),
}).strict();
