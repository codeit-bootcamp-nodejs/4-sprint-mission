import z from 'zod';

export const productSchema = {
  updatePrice: z.object({
    price: z.number().int({ message: '정수를 입력해주세요' }).positive(),
  }),
};
