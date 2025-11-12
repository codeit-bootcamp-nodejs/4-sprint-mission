import type { User } from '@prisma/client';

export const omitPassword = (user: User) => {
    const { password, ...rest } = user;
    return rest;
};
