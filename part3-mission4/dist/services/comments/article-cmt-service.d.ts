declare class ArticleCommentService {
    updateComment: (commentId: number, userId: number, content: string) => Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        content: string;
        articleId: number | null;
        productId: number | null;
    }>;
    deleteComment: (commentId: number, userId: number) => Promise<{
        message: string;
    }>;
    commentLike: (userId: number, commentId: number) => Promise<{
        message: string;
        likeCount: any;
    }>;
    commentUnlike: (userId: number, commentId: number) => Promise<{
        message: string;
        likeCount: any;
    }>;
    getCommentsByArticleId(articleId: number, userId?: number): Promise<{
        likeCount: any;
        isLiked: boolean;
        user: {
            username: string;
        };
        id: number;
        createdAt: Date;
        updatedAt: Date;
        content: string;
    }[]>;
    createArticleComment(articleId: number, content: string, userId: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        content: string;
        articleId: number | null;
        productId: number | null;
    }>;
}
export declare const articleCommentService: ArticleCommentService;
export {};
//# sourceMappingURL=article-cmt-service.d.ts.map