import productRepository from '../repositories/productRepository.js';

// 상품 생성 비즈니스 로직
async function createProduct(userId, productData: ProductDataInput) {
    return await productRepository.save({
        ...productData,
        authorId: userId,
    });
}

//   // 상품 목록 조회 비즈니스 로직
//   async getProducts(q, offset = '0', limit = '10', orderBy = 'recent') {
//     const skip = Number(offset);
//     const take = Number(limit);

//     if (isNaN(skip) || isNaN(take)) {
//       throw new Error('offset과 limit 값은 숫자여야 합니다.');
//     }

//     return productRepository.findMany(q, skip, take, orderBy);
//   },

//   // 상품 상세 조회 비즈니스 로직
//   async getProductById(id) {
//     const productId = Number(id);
//     if (isNaN(productId)) {
//       throw new Error('유효하지 않은 상품 ID입니다.');
//     }
//     return productRepository.findById(productId);
//   },

//   // 상품 수정 비즈니스 로직
//   async updateProduct(id, updatedData) {
//     const productId = Number(id);
//     if (isNaN(productId)) {
//       throw new Error('유효하지 않은 상품 ID입니다.');
//     }
//     return productRepository.updateProduct(productId, updatedData);
//   },

//   // 상품 삭제 비즈니스 로직
//   async deleteProduct(id) {
//     const productId = Number(id);
//     if (isNaN(productId)) {
//       throw new Error('유효하지 않은 상품 ID입니다.');
//     }
//     return productRepository.deleteProduct(productId);
//   },
// };

export default {
    createProduct,
};
