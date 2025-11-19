import * as z from 'zod';

export const postSchema = z
  .object({
    name: z.string().min(1, '상품 이름을 입력해주세요').max(10),
    description: z.string().min(10, '상품 설명을 입력해주세요'),
    price: z.number(),
    tags: z
      .array(z.string())
      .min(1, '1글자 이상 입력해주세요')
      .max(5, '5글자 이내로 입력해주세요')
      .refine(
        (tags) => {
          const tagSet = new Set(tags);
          return tagSet.size === tags.length;
        },
        {
          message: '태그에 중복된 값을 입력할 수 없습니다.',
        },
      ),
    imageUrls: z.array(z.string()).optional(),
  })
  .strict();
