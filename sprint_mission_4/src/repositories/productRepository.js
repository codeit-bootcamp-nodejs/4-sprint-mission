import prisma from '../config/prisma.js';

// 상품 저장
async function save(product, id) {
    return prisma.product.create({
        data: {
            description: product.description,
            price: product.price,
            title: product.title,
            owner: {
                connect: {
                    id,
                }
            }
        }
    })
}

async function findProductById(id) {
    return prisma.product.findUnique({
        where: {
            id,
        }
    })
}

//상품 수정
async function update(id, data) {
    return prisma.product.update({
        where: {
            id,
        },
        data,
    })
}

//상품 삭제
async function deleteProduct(id) {
    return prisma.product.delete({
        where: {
            id,
        },
    });
}

//유저가 등록한 상품 조회
async function getUserProduct(userId) {
    return prisma.product.findMany({
        where: {
            ownerId: userId,
        },
    })
}

export default {
    save,
    findProductById,
    update,
    deleteProduct,
    getUserProduct,
}



