type ArticleQuery = {
    page?: number;
    limit?: number;
    sort?: 'recent' | 'old';
    keyword?: string;
};
declare class ArticleService {
    getAllArticles(query: ArticleQuery, userId?: number): Promise<{
        data: {
            isLiked: boolean;
            likeCount: number;
            user: {
                username: string;
            };
            comments: {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                userId: number;
                likeCount: number;
                content: string;
                articleId: number | null;
                productId: number | null;
            }[];
            likedBy: {
                id: number;
                username: string;
                email: string;
                images: string[];
                password: string;
                createdAt: Date;
                updatedAt: Date;
            }[];
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
        isLiked: boolean;
        likeCount: number;
        comments: {
            isLiked: boolean;
            user: {
                username: string;
            };
            id: number;
            createdAt: Date;
            updatedAt: Date;
            likeCount: number;
            content: string;
            likedBy: {
                id: number;
                username: string;
                email: string;
                images: string[];
                password: string;
                createdAt: Date;
                updatedAt: Date;
            }[];
        }[];
        user: {
            username: string;
        };
        likedBy: {
            id: number;
            username: string;
            email: string;
            images: string[];
            password: string;
            createdAt: Date;
            updatedAt: Date;
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
        likeCount: number;
        title: string;
        content: string;
    }>;
    updateArticle(id: number, updateData: Record<string, any>, userId: number): Promise<{
        message: string;
    }>;
    deleteArticle(id: number, userId: number): Promise<{
        message: string;
    }>;
    getUserArticles(userId: number): Promise<{
        id: number;
        images: string[];
        tags: string[];
        likeCount: number;
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
        likeCount: number;
        title: string;
        content: string;
    }[]>;
    articleLike(userId: number, articleId: number): Promise<{
        id: number;
        images: string[];
        createdAt: Date;
        updatedAt: Date;
        tags: string[];
        userId: number;
        likeCount: number;
        title: string;
        content: string;
    }>;
    articleUnlike(userId: number, articleId: number): Promise<{
        id: number;
        images: string[];
        createdAt: Date;
        updatedAt: Date;
        tags: string[];
        userId: number;
        likeCount: number;
        title: string;
        content: string;
    }>;
}
export declare const articleService: ArticleService;
export {};
//# sourceMappingURL=article-service.d.ts.map