import prisma from '../lib/prisma';
›
  // DB에서 상품 생성
  async function save (productData) {
    return prisma.product.create({
      data: productData,
    });
  }

//   // DB에서 상품 목록 조회
//   async findMany(q, skip, take, orderBy) {
//     const orderByCondition = orderBy === 'recent' ? { createdAt: 'desc' } : {};
//     const whereCondition = q
//       ? {
//           OR: [
//             { name: { contains: q, mode: 'insensitive' } },
//             { description: { contains: q, mode: 'insensitive' } },
//           ],
//         }
//       : {};

//     return prisma.product.findMany({
//       where: whereCondition,
//       skip,
//       take,
//       orderBy: orderByCondition,
//     });
//   },

//   // DB에서 상품 ID로 조회
//   async findById(productId) {
//     return prisma.product.findUnique({
//       where: {
//         id: productId,
//       },
//     });
//   },

//   // DB에서 상품 수정
//   async updateProduct(productId, updatedData) {
//     return prisma.product.update({
//       where: { id: productId },
//       data: updatedData,
//     });
//   },

//   // DB에서 상품 삭제
//   async deleteProduct(productId) {
//     return prisma.product.delete({
//       where: { id: productId },
//     });
//   },
// };

export default {
save,
};