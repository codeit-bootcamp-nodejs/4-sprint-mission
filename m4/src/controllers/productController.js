import * as productService from '../services/productService.js';
import { sendResponse } from '../utils/response.js';

// 상품 등록 요청 처리
export const createProduct = async (req, res, next) => {
    try {
        const { name, description, price, tags } = req.body;
        const userId = req.user.id;
        const newProduct = await productService.createProduct({
            name,
            description,
            price,
            tags,
            userId,
        });
        sendResponse(res, 201, '상품이 성공적으로 등록되었습니다.', newProduct);
    } catch (error) {
        next(error);
    }
};

// 전체 상품 목록 조회 요청 처리
export const getAllProducts = async (req, res, next) => {
    try {
        const products = await productService.findProducts();
        sendResponse(res, 200, '상품 목록 조회 성공', products);
    } catch (error) {
        next(error);
    }
};

// 특정 상품 상세 조회 요청 처리
export const getProductById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user ? req.user.id : null; // 유저가 로그인되어 있지 않으면 null
        const product = await productService.findProductById(parseInt(id, 10), userId);
        sendResponse(res, 200, '상품 조회 성공', product);
    } catch (error) {
        next(error);
    }
};

// 상품 수정 요청 처리
export const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { name, description, price, tags } = req.body;

        const updatedProduct = await productService.updateProduct(parseInt(id, 10), userId, {
            name,
            description,
            price,
            tags,
        });
        sendResponse(res, 200, '상품이 성공적으로 수정되었습니다.', updatedProduct);
    } catch (error) {
        next(error);
    }
};

// 상품 삭제 요청 처리
export const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const result = await productService.deleteProduct(parseInt(id, 10), userId);
        sendResponse(res, 200, result.message);
    } catch (error) {
        next(error);
    }
};
