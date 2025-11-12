import z from 'zod';

const notificationId = z.number().int().positive();

export const notificationSchema = {
  read: z.object({
    notificationIds: z.array(notificationId).min(1),
  }),
};
