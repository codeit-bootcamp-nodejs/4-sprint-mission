import express from 'express';
import productService from '../services/productService.js';
import passport from '../config/passport.js';

const productController = express.Router();

//------------------------------------------------------------------------
productController.post('/', passport.authenticate('access-token', { session: false }),
    async (req, res, next) => {
        try {
            const { name, description, price, tags } = req.body;

            // passport.authenticate 미들웨어가 토큰을 검증하고 req.user에 사용자 정보를 넣어줍니다.
            const { userId } = (req.user as {userId: string | number});

            if (!name || !description || !price) {
                return res.status(400).json({ error: '상품 이름, 설명, 가격은 필수 항목입니다.' });
            }

            // 서비스 계층으로 로직 위임 (userId와 상품 데이터 전달)
            const newProduct = await productService.createProduct(userId, {
                name,
                description,
                price,
                tags,
            });
            res.status(201).json(newProduct);
        } catch (error) {
            // 에러 발생 시 중앙 에러 핸들러로 전달
            next(error);
        }
        
    });

// productController = {
//   // 상품 생성
//   async createProduct(req, res, next) {
//     try {
//       const { name, description, price, tags } = req.body;
//       const { userId } = req.user;

//       if (!name || !description || !price) {
//         return res.status(400).json({ error: '상품 이름, 설명, 가격은 필수 항목입니다.' });
//       }

//       const newProduct = await productService.createProduct(userId, { name, description, price, tags });
//       res.status(201).json(newProduct);
//     } catch (error) {
//       next(error);
//     }
//   },}

//   // 상품 목록 조회
//   async getProducts(req, res, next) {
//     try {
//       const { q, offset, limit, orderBy } = req.query;
//       const products = await productService.getProducts(q, offset, limit, orderBy);
//       res.status(200).json(products);
//     } catch (error) {
//       next(error);
//     }
//   },

//   // 상품 상세 조회
//   async getProductById(req, res, next) {
//     try {
//       const { id } = req.params;
//       const product = await productService.getProductById(id);

//       if (!product) {
//         return res.status(404).json({ error: '상품을 찾을 수 없습니다.' });
//       }
//       res.status(200).json(product);
//     } catch (error) {
//       next(error);
//     }
//   },

//   // 상품 수정
//   async updateProduct(req, res, next) {
//     try {
//       const { id } = req.params;
//       const updatedData = req.body;
//       const updatedProduct = await productService.updateProduct(id, updatedData);
//       res.status(200).json(updatedProduct);
//     } catch (error) {
//       next(error);
//     }
//   },

//   // 상품 삭제
//   async deleteProduct(req, res, next) {
//     try {
//       const { id } = req.params;
//       await productService.deleteProduct(id);
//       res.status(204).send();
//     } catch (error) {
//       next(error);
//     }
//   }
// };

export default productController;

// productController.post('/product',
//     passport.authenticate('access-token'), { session: false }),
//     // authMiddleware.checkProductAuth, 특정 상품에 대한 권한을 확인하는 미들웨어 그러므로 상품등록할 때는  상품이 존재하지 않으므로 필요없음
//     async (req, res, next) => {
//         const { id: userId } = req.user;
//    }
