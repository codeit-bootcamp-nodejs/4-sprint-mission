import prisma from '../config/prisma.js';

// 새로운 상품을 생성합니다.
export const createProduct = async (data, tx = prisma) => {
    return tx.product.create({ data });
};

// 모든 상품 목록을 조회합니다.
export const findProducts = async (tx = prisma) => {
    return tx.product.findMany();
};

// ID를 사용하여 태그 정보와 함께 특정 상품을 조회합니다.
export const findProductWithTagsById = async (id, tx = prisma) => {
    return tx.product.findUnique({
        where: { id },
        include: {
            productTags: {
                include: {
                    tag: true,
                },
            },
        },
    });
};

// 특정 상품의 정보를 업데이트합니다.
export const updateProduct = async (id, data, tx = prisma) => {
    return tx.product.update({
        where: { id },
        data,
    });
};

// 특정 상품을 삭제합니다.
export const deleteProduct = async (id, tx = prisma) => {
    return tx.product.delete({
        where: { id },
    });
};
