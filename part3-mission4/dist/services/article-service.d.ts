import type { ArticleQuery } from '../types/article-types.js';
declare class ArticleService {
    getAllArticles(query: ArticleQuery, userId?: number): Promise<{
        data: {
            likeCount: any;
            isLiked: boolean;
            comments: {
                likeCount: any;
                isLiked: boolean;
                id: number;
                content: string;
                likedBy: never;
            }[];
            user: {
                username: string;
            };
            likedBy: never;
            id: number;
            images: string[];
            createdAt: Date;
            updatedAt: Date;
            tags: string[];
            userId: number;
            title: string;
            content: string;
        }[];
        pagination: {
            totalArticles: number;
            totalPages: number;
            currentPage: number;
            limit: number;
        };
    }>;
    getArticleById(articleId: number, userId?: number): Promise<{
        likeCount: any;
        isLiked: boolean;
        comments: {
            likeCount: any;
            isLiked: boolean;
            user: {
                username: string;
            };
            id: number;
            createdAt: Date;
            updatedAt: Date;
            userId: number;
            content: string;
            articleId: number | null;
            productId: number | null;
        }[];
        user: {
            username: string;
        };
        likes: {
            id: number;
            createdAt: Date;
            userId: number;
            articleId: number;
        }[];
        id: number;
        images: string[];
        createdAt: Date;
        updatedAt: Date;
        tags: string[];
        userId: number;
        title: string;
        content: string;
    }>;
    createArticle(title: string, content: string, userId: number): Promise<{
        id: number;
        images: string[];
        createdAt: Date;
        updatedAt: Date;
        tags: string[];
        userId: number;
        title: string;
        content: string;
    }>;
    updateArticle(articleId: number, userId: number, updateData: Record<string, any>): Promise<{
        message: string;
    }>;
    deleteArticle(articleId: number, userId: number): Promise<{
        message: string;
    }>;
    getUserArticles(userId: number): Promise<{
        id: number;
        images: string[];
        tags: string[];
        title: string;
        content: string;
    }[]>;
    getUserLikedArticles(userId: number): Promise<{
        id: number;
        images: string[];
        createdAt: Date;
        updatedAt: Date;
        tags: string[];
        userId: number;
        title: string;
        content: string;
    }[]>;
    articleLike(userId: number, articleId: number): Promise<{
        message: string;
        likeCount: any;
    }>;
    articleUnlike(userId: number, articleId: number): Promise<{
        message: string;
        likeCount: any;
    }>;
}
export declare const articleService: ArticleService;
export {};
//# sourceMappingURL=article-service.d.ts.map