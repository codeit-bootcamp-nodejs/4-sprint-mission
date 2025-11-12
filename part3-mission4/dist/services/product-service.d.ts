import type { ProductQuery } from '../types/product-types.js';
declare class ProductService {
    getAllProducts(query: ProductQuery, userId?: number): Promise<{
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
            productId: number;
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
    }>;
    updateProduct(productId: number, userId: number, updateData: Record<string, any>): Promise<{
        message: string;
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
    }[]>;
    productLike(userId: number, productId: number): Promise<{
        message: string;
        likeCount: any;
    }>;
    productUnlike(userId: number, productId: number): Promise<{
        message: string;
        likeCount: any;
    }>;
}
export declare const productService: ProductService;
export {};
//# sourceMappingURL=product-service.d.ts.map