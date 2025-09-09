type ProductQuery = {
    page?: number;
    limit?: number;
    sort?: 'recent' | 'old';
    keyword?: string;
};
declare class ProductService {
    getAllProducts(query: ProductQuery, userId: number): Promise<{
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
            name: string;
            id: number;
            images: string[];
            createdAt: Date;
            updatedAt: Date;
            description: string;
            price: number;
            tags: string[];
            userId: number;
        }[];
        pagination: {
            totalProducts: number;
            totalPages: number;
            currentPage: number;
            limit: number;
        };
    }>;
    getProductById(productId: number, userId?: number): Promise<{
        isLiked: boolean;
        likeCount: number;
        comments: {
            isLiked: boolean;
            likeCount: number;
            user: {
                username: string;
            };
            id: number;
            createdAt: Date;
            updatedAt: Date;
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
        name: string;
        id: number;
        images: string[];
        createdAt: Date;
        updatedAt: Date;
        description: string;
        price: number;
        tags: string[];
        userId: number;
    }>;
    createProduct(userId: number, name: string, description: string, price: number, tags: string[]): Promise<{
        name: string;
        id: number;
        images: string[];
        createdAt: Date;
        updatedAt: Date;
        description: string;
        price: number;
        tags: string[];
        userId: number;
        likeCount: number;
    }>;
    updateProduct(productId: number, userId: number, updateData: Record<string, any>): Promise<{
        name: string;
        id: number;
        images: string[];
        description: string;
        price: number;
        tags: string[];
    }>;
    deleteProduct(productId: number, userId: number): Promise<{
        message: string;
    }>;
    getUserProducts(userId: number): Promise<{
        name: string;
        id: number;
        images: string[];
        description: string;
        price: number;
        tags: string[];
        likeCount: number;
    }[]>;
    getUserLikedProducts(userId: number): Promise<{
        name: string;
        id: number;
        images: string[];
        createdAt: Date;
        updatedAt: Date;
        description: string;
        price: number;
        tags: string[];
        userId: number;
        likeCount: number;
    }[]>;
    productLike(userId: number, productId: number): Promise<{
        name: string;
        id: number;
        images: string[];
        createdAt: Date;
        updatedAt: Date;
        description: string;
        price: number;
        tags: string[];
        userId: number;
        likeCount: number;
    }>;
    productUnlike(userId: number, productId: number): Promise<{
        name: string;
        id: number;
        images: string[];
        createdAt: Date;
        updatedAt: Date;
        description: string;
        price: number;
        tags: string[];
        userId: number;
        likeCount: number;
    }>;
}
export declare const productService: ProductService;
export {};
//# sourceMappingURL=product-service.d.ts.map