import z from 'zod';

export const productSchema = {
  updatePrice: {
    params: z.object({
      productId: z.coerce.number().int().positive(),
    }),
    body: z.object({
      price: z.number().int({ message: '정수를 입력해주세요' }).positive(),
    }),
  },
};
