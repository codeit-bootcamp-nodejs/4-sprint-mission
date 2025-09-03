import express from 'express';

const productRouter = (productController) => {
  const router = express.Router();

  router
    .route('/')
    .post(productController.createProduct) // 상품 등록
    .get(productController.getProducts); // 상품 목록 조회

  router
    .route('/:id')
    .get(productController.getProductById) // 상품 상세 조회
    .patch(productController.updateProduct) // 상품 수정
    .delete(productController.deleteProduct); // 상품 삭제

  return router;
};

export default productRouter;
