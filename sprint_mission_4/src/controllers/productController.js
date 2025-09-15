import express from 'express';
import passport from '../config/passport.js';
import productService from '../services/productService.js';

const controller = express.Router();

//상품 등록
controller.post('/',
    passport.authenticate('access-token', { session: false }),
    async (req, res, next) => {
        try {
            const userId = req.user.id;
            const productData = req.body;
            const product = await productService.createProduct(productData, userId);
            return res.status(201).json(product);
        } catch (error) {
            next(error);
        }
    })

// 상품 수정
controller.patch('/:productId',
    passport.authenticate('access-token', { session: false }),
    async (req, res, next) => {
        try {
            const userId = req.user.id;
            const productId = parseInt(req.params.productId, 10);
            const productData = req.body;
            await productService.updateProduct(productId, productData, userId)
            return res.status(200).json({ message: 'Product updated successfully.' });
        } catch (error) {
            next(error);
        }
    })

//상품 삭제
controller.delete('/:productId',
    passport.authenticate('access-token', { session: false }),
    async (req, res, next) => {
        try {
            const userId = req.user.id;
            const productId = parseInt(req.params.productId);
            await productService.deleteProduct(productId, userId);
            return res.status(200).json({ "message": "Product deleted successfully" });
        } catch (error) {
            next(error);
        }
    })


export default controller;