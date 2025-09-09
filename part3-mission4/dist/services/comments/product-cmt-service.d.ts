declare class ProductCommentService {
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
    getCommentsByProductId(productId: number, userId?: number): Promise<{
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
    createProductComment(productId: number, content: string, userId: number): Promise<{
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
export declare const productCommentService: ProductCommentService;
export {};
//# sourceMappingURL=product-cmt-service.d.ts.map