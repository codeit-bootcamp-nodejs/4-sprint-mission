import productRepository from '../repositories/productRepository.js';

//상품 생성
async function createProduct(productData, userId) {
    return await productRepository.save(productData, userId);
}

async function updateProduct(productId, productData, userId) {
    const product = await productRepository.findProductById(productId);
    if (!product) {
        const error = new Error('not found');
        error.code = 404;
        throw error;
    }

    if (product.ownerId !== userId) {
        const error = new Error('Permission denied');
        error.code = 403;
        throw error;
    }
    return await productRepository.update(productId, productData);
}

async function deleteProduct(productId, userId) {
    //post id 조회
    const product = await productRepository.findProductById(productId);
    if (!product) {
        const error = new Error('not found');
        error.code = 404;
        throw error;
    }

    if (product.ownerId !== userId) {
        const error = new Error('Permission denied');
        error.code = 403;
        throw error;
    }
    return await productRepository.deleteProduct(productId);
}

export default {
    createProduct,
    updateProduct,
    deleteProduct,
}