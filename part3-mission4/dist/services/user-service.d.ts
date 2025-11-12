import type { Response } from 'express';
declare class UserService {
    register(username: string, email: string, password: string): Promise<Omit<{
        id: number;
        username: string;
        email: string;
        images: string[];
        password: string;
        createdAt: Date;
        updatedAt: Date;
    }, "password">>;
    login(userId: number): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    getUserProfile(userId: number): Promise<{
        id: number;
        username: string;
        email: string;
        images: string[];
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    updateUserProfile(userId: number, updateData: any): Promise<{
        username: string;
        email: string;
        images: string[];
    }>;
    updatePassword(userId: number, currentPassword: string, newPassword: string): Promise<Omit<{
        id: number;
        username: string;
        email: string;
        images: string[];
        password: string;
        createdAt: Date;
        updatedAt: Date;
    }, "password">>;
    getUserComments(userId: number): Promise<{
        likeCount: any;
        id: number;
        createdAt: Date;
        product: {
            name: string;
            id: number;
        } | null;
        article: {
            id: number;
            title: string;
        } | null;
        content: string;
    }[]>;
    getUserLikedComments(userId: number): Promise<{
        likeCount: any;
        isLiked: boolean;
        id: number;
        createdAt: Date;
        product: {
            name: string;
            id: number;
        } | null;
        article: {
            id: number;
            title: string;
        } | null;
        content: string;
    }[]>;
    setTokenCookies(res: Response, accessToken: string, refreshToken: string): void;
    clearTokenCookies(res: Response): void;
    refreshTokens(refreshToken: string, res: Response): Promise<string>;
}
export declare const userService: UserService;
export {};
//# sourceMappingURL=user-service.d.ts.map