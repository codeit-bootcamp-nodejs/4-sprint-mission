import { prisma } from '../setup/testDatabase.js';
import { hashPassword } from '../../src/utils/bcrypt.js';
import type { User, Product, Post } from '@prisma/client';

export const createTestUser = async (overrides?: Partial<User>): Promise<User> => {
    const hashedPassword = await hashPassword('password123');

    return prisma.user.create({
        data: {
            email: overrides?.email || `test${Date.now()}@example.com`,
            password: hashedPassword,
            nickname: overrides?.nickname || `TestUser${Date.now()}`,
            image: overrides?.image || null,
        },
    });
};

export const createTestProduct = async (userId: number, overrides?: Partial<Product>): Promise<Product> => {
    return prisma.product.create({
        data: {
            name: overrides?.name || `Test Product ${Date.now()}`,
            description: overrides?.description || 'Test product description',
            price: overrides?.price || 10000,
            userId: userId,
        },
    });
};

export const createTestPost = async (userId: number, overrides?: Partial<Post>): Promise<Post> => {
    return prisma.post.create({
        data: {
            title: overrides?.title || `Test Post ${Date.now()}`,
            content: overrides?.content || 'Test post content',
            userId: userId,
        },
    });
};

export const createTestComment = async (
    userId: number,
    resourceType: 'product' | 'post',
    resourceId: number,
    content?: string,
) => {
    return prisma.comment.create({
        data: {
            content: content || 'Test comment',
            userId: userId,
            ...(resourceType === 'product' ? { productId: resourceId } : { postId: resourceId }),
        },
    });
};

export const createTestLike = async (userId: number, resourceType: 'product' | 'post', resourceId: number) => {
    return prisma.like.create({
        data: {
            userId,
            ...(resourceType === 'product' ? { productId: resourceId } : { postId: resourceId }),
        },
    });
};
