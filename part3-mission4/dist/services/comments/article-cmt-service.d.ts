declare class ArticleCommentService {
    updateComment: (commentId: number, userId: number, content: string) => Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        likeCount: number;
        content: string;
        articleId: number | null;
        productId: number | null;
    }>;
    deleteComment: (commentId: number, userId: number) => Promise<{
        message: string;
    }>;
    commentLike: (userId: number, commentId: number) => Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        likeCount: number;
        content: string;
        articleId: number | null;
        productId: number | null;
    }>;
    commentUnlike: (userId: number, commentId: number) => Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        likeCount: number;
        content: string;
        articleId: number | null;
        productId: number | null;
    }>;
    getCommentsByArticleId(articleId: number, userId?: number): Promise<{
        isLiked: boolean;
        likeCount: number;
        user: {
            username: string;
        };
        likedBy: {
            id: number;
        }[];
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        content: string;
        articleId: number | null;
        productId: number | null;
    }[]>;
    createArticleComment(articleId: number, content: string, userId: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        likeCount: number;
        content: string;
        articleId: number | null;
        productId: number | null;
    }>;
}
export declare const articleCommentService: ArticleCommentService;
export {};
//# sourceMappingURL=article-cmt-service.d.ts.map