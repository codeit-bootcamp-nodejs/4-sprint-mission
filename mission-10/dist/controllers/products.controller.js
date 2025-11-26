import { ProductsService } from '../services/products.service.js';
export class ProductsController {
    constructor() {
        this.productsService = new ProductsService();
        // 상품 등록
        this.createProduct = async (req, res, next) => {
            try {
                const createProductDto = req.body; // Use DTO
                const user = req.user;
                if (!user) {
                    return res.status(401).json({ message: '인증 정보가 없습니다.' });
                }
                const userId = user.id;
                if (!createProductDto.name || !createProductDto.content) { // Validate DTO fields
                    return res.status(400).json({ message: '상품명과 내용을 모두 입력해주세요.' });
                }
                const newProduct = await this.productsService.createProduct(createProductDto, userId); // Pass DTO
                return res.status(201).json({ data: newProduct });
            }
            catch (err) {
                next(err);
            }
        };
        // 상품 목록 조회
        this.getProducts = async (req, res, next) => {
            try {
                const products = await this.productsService.getProducts();
                return res.status(200).json({ data: products });
            }
            catch (err) {
                next(err);
            }
        };
        // 상품 상세 조회
        this.getProductById = async (req, res, next) => {
            try {
                const { productId } = req.params;
                const user = req.user;
                const product = await this.productsService.getProductById(+productId, user?.id);
                return res.status(200).json({ data: product });
            }
            catch (err) {
                if (err.name === "NotFoundError") {
                    return res.status(404).json({ message: err.message });
                }
                next(err);
            }
        };
        // 상품 수정
        this.updateProduct = async (req, res, next) => {
            try {
                const { productId } = req.params;
                const updateProductDto = req.body; // Use DTO
                const user = req.user;
                if (!user) {
                    return res.status(401).json({ message: '인증 정보가 없습니다.' });
                }
                const userId = user.id;
                const updatedProduct = await this.productsService.updateProduct(+productId, userId, updateProductDto); // Pass DTO
                return res.status(200).json({ data: updatedProduct });
            }
            catch (err) {
                if (err.name === "NotFoundError") {
                    return res.status(404).json({ message: err.message });
                }
                if (err.name === "ForbiddenError") {
                    return res.status(403).json({ message: err.message });
                }
                if (err.name === "BadRequestError") {
                    return res.status(400).json({ message: err.message });
                }
                next(err);
            }
        };
        // 상품 삭제
        this.deleteProduct = async (req, res, next) => {
            try {
                const { productId } = req.params;
                const user = req.user;
                if (!user) {
                    return res.status(401).json({ message: "인증 정보가 없습니다." });
                }
                const userId = user.id;
                await this.productsService.deleteProduct(+productId, userId);
                return res.status(200).json({ message: "상품이 성공적으로 삭제 완료" });
            }
            catch (err) {
                if (err.name === "NotFoundError") {
                    return res.status(404).json({ message: err.message });
                }
                if (err.name === "ForbiddenError") {
                    return res.status(403).json({ message: err.message });
                }
                next(err);
            }
        };
        // 상품 좋아요/좋아요 취소
        this.toggleProductLike = async (req, res, next) => {
            try {
                const { productId } = req.params;
                const user = req.user;
                if (!user) {
                    return res.status(401).json({ message: "인증 정보가 없습니다." });
                }
                const userId = user.id;
                const result = await this.productsService.toggleProductLike(+productId, userId);
                return res.status(200).json(result);
            }
            catch (err) {
                if (err.name === "NotFoundError") {
                    return res.status(404).json({ message: err.message });
                }
                next(err);
            }
        };
        // 특정 유저가 등록한 상품 목록 조회
        this.getMyProducts = async (req, res, next) => {
            try {
                const user = req.user;
                if (!user) {
                    return res.status(401).json({ message: "인증 정보가 없습니다." });
                }
                const products = await this.productsService.getProductsByAuthor(user.id);
                return res.status(200).json({ data: products });
            }
            catch (err) {
                next(err);
            }
        };
        // 내가 '좋아요' 누른 상품 목록 조회
        this.getLikedProducts = async (req, res, next) => {
            try {
                const user = req.user;
                if (!user) {
                    return res.status(401).json({ message: "인증 정보가 없습니다." });
                }
                const likedProducts = await this.productsService.getLikedProducts(user.id);
                return res.status(200).json({ data: likedProducts });
            }
            catch (err) {
                next(err);
            }
        };
    }
}
