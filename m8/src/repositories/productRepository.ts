import { Prisma } from '@prisma/client';
import prisma from '../config/prisma.js';
import type { CreateProductData, UpdateProductData } from '../types/product.js';

type PrismaTransaction = Prisma.TransactionClient;

// 새로운 상품을 생성합니다.
export const createProduct = async (data: CreateProductData, tx: PrismaTransaction = prisma) => {
    return tx.product.create({ data });
};

// 모든 상품 목록을 조회합니다.
export const findProducts = async (tx: PrismaTransaction = prisma) => {
    return tx.product.findMany({
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    nickname: true,
                },
            },
            productTags: {
                include: {
                    tag: true,
                },
            },
        },
    });
};

// ID를 사용하여 태그 정보와 함께 특정 상품을 조회합니다.
export const findProductWithTagsById = async (id: number, tx: PrismaTransaction = prisma) => {
    return tx.product.findUnique({
        where: { id },
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    nickname: true,
                },
            },
            productTags: {
                include: {
                    tag: true,
                },
            },
        },
    });
};

// 특정 상품의 정보를 업데이트합니다.
export const updateProduct = async (id: number, data: UpdateProductData, tx: PrismaTransaction = prisma) => {
    return tx.product.update({
        where: { id },
        data,
    });
};

// 특정 상품을 삭제합니다.
export const deleteProduct = async (id: number, tx: PrismaTransaction = prisma) => {
    return tx.product.delete({
        where: { id },
    });
};

// 유저 ID로 상품 목록 조회
export const findProductsByUserId = async (userId: number, tx: PrismaTransaction = prisma) => {
    return tx.product.findMany({
        where: { userId },
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    nickname: true,
                },
            },
            productTags: {
                include: {
                    tag: true,
                },
            },
        },
    });
};

// ID로 상품 조회 (태그 정보 없이)
export const findProductById = async (id: number, tx: PrismaTransaction = prisma) => {
    return tx.product.findUnique({
        where: { id },
    });
};

// 태그와 함께 상품 생성
export const createProductWithTags = async (data: CreateProductData, tx: PrismaTransaction = prisma) => {
    return tx.product.create({
        data: {
            name: data.name,
            description: data.description,
            price: data.price,
            userId: data.userId,
            productTags: {
                create: data.tags.map((tagName) => ({
                    tag: {
                        connectOrCreate: {
                            where: { name: tagName },
                            create: { name: tagName },
                        },
                    },
                })),
            },
        },
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    nickname: true,
                },
            },
            productTags: {
                include: {
                    tag: true,
                },
            },
        },
    });
};

// 태그와 함께 상품 업데이트
export const updateProductWithTags = async (id: number, data: UpdateProductData, tx: PrismaTransaction = prisma) => {
    return tx.product.update({
        where: { id },
        data: {
            name: data.name,
            description: data.description,
            price: data.price,
            productTags: {
                deleteMany: {}, // 기존 태그 연결 삭제
                create: data.tags.map((tagName) => ({
                    tag: {
                        connectOrCreate: {
                            where: { name: tagName },
                            create: { name: tagName },
                        },
                    },
                })),
            },
        },
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    nickname: true,
                },
            },
            productTags: {
                include: {
                    tag: true,
                },
            },
        },
    });
};
