// src/routes/products.js

const express = require('express');
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// --- 1. 인증이 필요 없는 공용 API ---
// 전체 상품 목록 조회
router.get('/', productController.getProducts);

// --- 2. 특정 경로 라우트 (파라미터 경로보다 먼저 정의) ---
// 내가 등록한 상품 목록 조회 (개별 라우트에 인증 미들웨어 적용)
router.get('/my', authMiddleware, productController.getMyProducts);

// 내가 좋아요한 상품 목록 조회
router.get('/liked', authMiddleware, productController.getLikedProducts);

// --- 3. 선택적 인증이 필요한 API ---
// 상품 상세 조회 (선택적 인증)
router.get('/:id', (req, res, next) => {
    // 인증 헤더가 있으면 인증 처리, 없으면 바로 다음으로 넘어감
    if (req.headers.authorization) {
        authMiddleware(req, res, next);
    } else {
        next();
    }
}, productController.getProductById);

// --- 4. 인증이 필요한 나머지 API ---
router.use(authMiddleware);

// 상품 생성
router.post('/', productController.createProduct);

// 상품 수정
router.put('/:id', productController.updateProduct);

// 상품 삭제
router.delete('/:id', productController.deleteProduct);

// 상품 좋아요
router.post('/:id/like', productController.likeProduct);

// 상품 좋아요 취소
router.delete('/:id/like', productController.unlikeProduct);

module.exports = router;