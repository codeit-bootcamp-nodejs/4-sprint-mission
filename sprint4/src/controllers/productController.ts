// src/controllers/productController.ts
import { Request, Response } from 'express';
import * as productService from '../services/productService';
import { CreateProduct } from '../types';

/**
 * 모든 상품 목록을 조회합니다.
 * 로그인한 사용자의 경우, 각 상품에 대한 '좋아요' 여부(`isLiked`)를 포함합니다.
 */
export const getProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const productsWithLikeStatus = await productService.getAllProductsWithLikeStatus(userId);
        res.status(200).json({ products: productsWithLikeStatus });
    } catch (error) {
        console.error('상품 목록 조회 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};

/**
 * 특정 ID의 상품을 상세 조회합니다.
 * 로그인한 사용자의 경우, '좋아요' 여부(`isLiked`)를 포함합니다.
 */
export const getProductById = async (req: Request, res: Response): Promise<void> => {
    try {
        const productId = parseInt(req.params.id);
        const userId = req.userId;
        const result = await productService.getProductWithLikeStatus(productId, userId);
        res.status(200).json(result);
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === '상품을 찾을 수 없습니다.') {
                res.status(404).json({ message: error.message });
            } else {
                res.status(500).json({ message: '서버 오류가 발생했습니다.' });
            }
        } else {
            res.status(500).json({ message: '알 수 없는 서버 오류입니다.' });
        }
    }
};

/**
 * 새로운 상품을 생성합니다.
 */
export const createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.userId!;
        const productData: CreateProduct = req.body;
        const newProduct = await productService.createProduct(productData, userId);
        res.status(201).json({ message: '상품이 성공적으로 등록되었습니다.', product: newProduct });
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: '서버 오류가 발생했습니다.' });
        }
    }
};

/**
 * 상품 정보를 수정합니다.
 */
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const productId = parseInt(req.params.id);
        const userId = req.userId!;
        const productData = req.body;
        const updatedProduct = await productService.updateProduct(productId, userId, productData);
        res.status(200).json({ message: '상품이 성공적으로 수정되었습니다.', product: updatedProduct });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes('권한이 없습니다')) {
                res.status(403).json({ message: error.message });
            } else if (error.message.includes('찾을 수 없습니다')) {
                res.status(404).json({ message: error.message });
            } else {
                res.status(400).json({ message: error.message });
            }
        } else {
            res.status(500).json({ message: '서버 오류가 발생했습니다.' });
        }
    }
};

/**
 * 상품을 삭제합니다.
 */
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const productId = parseInt(req.params.id);
        const userId = req.userId!;
        await productService.deleteProduct(productId, userId);
        res.status(200).json({ message: '상품이 성공적으로 삭제되었습니다.' });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes('권한이 없습니다')) {
                res.status(403).json({ message: error.message });
            } else if (error.message.includes('찾을 수 없습니다')) {
                res.status(404).json({ message: error.message });
            } else {
                res.status(500).json({ message: '서버 오류가 발생했습니다.' });
            }
        } else {
            res.status(500).json({ message: '서버 오류가 발생했습니다.' });
        }
    }
};

/**
 * 내가 등록한 상품 목록을 조회합니다.
 */
export const getMyProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.userId!;
        const products = await productService.getMyProducts(userId);
        res.status(200).json({ products });
    } catch (error) {
        console.error('내 상품 목록 조회 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};

/**
 * 내가 좋아요한 상품 목록을 조회합니다.
 */
export const getLikedProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.userId!;
        const products = await productService.getLikedProducts(userId);
        res.status(200).json({ products });
    } catch (error) {
        console.error('좋아요한 상품 목록 조회 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};

/**
 * 상품에 좋아요를 추가합니다.
 */
export const likeProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const productId = parseInt(req.params.id);
        const userId = req.userId!;
        await productService.likeProduct(productId, userId);
        res.status(201).json({ message: '상품에 좋아요를 눌렀습니다.' });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes('이미 좋아요')) {
                res.status(409).json({ message: error.message });
            } else if (error.message.includes('찾을 수 없습니다')) {
                res.status(404).json({ message: error.message });
            } else {
                res.status(500).json({ message: '서버 오류가 발생했습니다.' });
            }
        } else {
            res.status(500).json({ message: '서버 오류가 발생했습니다.' });
        }
    }
};

/**
 * 상품 좋아요를 취소합니다.
 */
export const unlikeProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const productId = parseInt(req.params.id);
        const userId = req.userId!;
        await productService.unlikeProduct(productId, userId);
        res.status(200).json({ message: '상품 좋아요가 취소되었습니다.' });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes('누르지 않은')) {
                res.status(404).json({ message: error.message });
            } else {
                res.status(500).json({ message: '서버 오류가 발생했습니다.' });
            }
        } else {
            res.status(500).json({ message: '서버 오류가 발생했습니다.' });
        }
    }
};