import z from 'zod';

const notificationId = z.number().int().positive({ message: '알림 ID는 양의 정수여야 합니다' });

export const notificationSchema = {
  list: {
    params: z.object({
      page: z.coerce.number().int().positive().default(1),
      limit: z.coerce.number().int().positive().max(100).default(20),
    }),
  },
  read: {
    body: z.object({
      notificationIds: z.array(notificationId).min(1, { message: '최소 1개의 알림 ID를 전달해야 합니다.' }),
    }),
  },
};
