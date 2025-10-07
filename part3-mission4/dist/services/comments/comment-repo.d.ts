export declare const commentRepository: {
    findById(commentId: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        likeCount: number;
        content: string;
        articleId: number | null;
        productId: number | null;
    } | null>;
    updateComment(commentId: number, userId: number, content: string): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        likeCount: number;
        content: string;
        articleId: number | null;
        productId: number | null;
    }>;
    deleteComment(commentId: number, userId: number): Promise<{
        message: string;
    }>;
    like(userId: number, commentId: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        likeCount: number;
        content: string;
        articleId: number | null;
        productId: number | null;
    }>;
    unlike(userId: number, commentId: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        likeCount: number;
        content: string;
        articleId: number | null;
        productId: number | null;
    }>;
};
//# sourceMappingURL=comment-repo.d.ts.map