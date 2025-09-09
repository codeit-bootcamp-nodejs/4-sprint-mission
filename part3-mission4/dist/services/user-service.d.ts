import { prisma } from '../lib/prismaClient.js';
import type { Response } from 'express';
type PrismaUpdateArg = Parameters<typeof prisma.user.update>[0];
type UserUpdateData = PrismaUpdateArg extends {
    data?: infer D;
} ? D : Record<string, unknown>;
type RawUser = NonNullable<Awaited<ReturnType<typeof prisma.user.findUnique>>>;
type UserWithoutPassword = Omit<RawUser, 'password'>;
declare class UserService {
    register(username: string, email: string, password: string): Promise<UserWithoutPassword>;
    login(userId: number): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    getUserProfile(userId: number): Promise<{
        id: number;
        username: string;
        email: string;
        images: string[];
    } | null>;
    updateUserProfile(userId: number, updateData: UserUpdateData): Promise<{
        username: string;
        email: string;
        images: string[] | null;
    }>;
    updatePassword(userId: number, currentPassword: string, newPassword: string): Promise<UserWithoutPassword>;
    getUserComments(userId: number): Promise<{
        product: {
            name: string;
            id: number;
        } | null;
        likeCount: number;
        article: {
            id: number;
            title: string;
        } | null;
        content: string;
    }[]>;
    getUserLikedComments(userId: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        likeCount: number;
        content: string;
        articleId: number | null;
        productId: number | null;
    }[]>;
    setTokenCookies(res: Response, accessToken: string, refreshToken: string): void;
    clearTokenCookies(res: Response): void;
    refreshTokens(refreshToken: string, res: Response): Promise<string>;
}
export declare const userService: UserService;
export {};
//# sourceMappingURL=user-service.d.ts.map