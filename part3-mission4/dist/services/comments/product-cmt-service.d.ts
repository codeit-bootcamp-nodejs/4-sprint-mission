declare class ProductCommentService {
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
    getCommentsByProductId(productId: number, userId?: number): Promise<{
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
    createProductComment(productId: number, content: string, userId: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        content: string;
        articleId: number | null;
        productId: number | null;
    }>;
}
export declare const productCommentService: ProductCommentService;
export {};
//# sourceMappingURL=product-cmt-service.d.ts.map