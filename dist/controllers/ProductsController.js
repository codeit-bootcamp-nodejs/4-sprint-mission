"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CommentService_1 = __importDefault(require("../CommentService"));
const LikeService_1 = __importDefault(require("../LikeService"));
const CommentRepository_1 = __importDefault(require("../repositories/CommentRepository"));
const LikeRepository_1 = __importDefault(require("../repositories/LikeRepository"));
class ProductsController {
    constructor(productService) {
        this.createProduct = async (req, res, next) => {
            try {
                const { name, description, price } = req.body;
                const { user } = req;
                if (!user) {
                    return res.status(401).json({ message: '사용자 정보를 찾을 수 없습니다.' });
                }
                const product = await this.productService.createProduct({
                    name,
                    content: description, // Map description to content
                    price,
                    userId: user.id,
                });
                res.status(201).json(product);
            }
            catch (error) {
                next(error);
            }
        };
        this.getProducts = async (req, res, next) => {
            try {
                const { sort, search } = req.query;
                let page = parseInt(req.query.page) || 1;
                let limit = parseInt(req.query.limit) || 10;
                let offset = (page - 1) * limit;
                const where = search
                    ? {
                        OR: [
                            { name: { contains: search, mode: 'insensitive' } },
                            { content: { contains: search, mode: 'insensitive'
                                } },
                        ],
                    }
                    : {};
                const user = req.user;
                const products = await this.productService.getProducts({
                    where,
                    orderBy: sort === 'recent' ? { createdAt: 'desc' } : undefined,
                    skip: offset,
                    take: limit,
                });
                let responseProducts = products;
                if (user) {
                    const productIds = products.map(product => product.id);
                    const likes = await this.likeService.findLikes({
                        where: {
                            userId: user.id,
                            productId: { in: productIds },
                        },
                    });
                    const likedProductIds = new Set(likes.map((like) => like.productId));
                    responseProducts = products.map(product => ({
                        ...product,
                        isLiked: likedProductIds.has(product.id),
                    }));
                }
                else {
                    responseProducts = products.map(product => ({
                        ...product,
                        isLiked: false,
                    }));
                }
                res.status(200).json(responseProducts);
            }
            catch (error) {
                next(error);
            }
        };
        this.getProductById = async (req, res, next) => {
            try {
                const { productId } = req.params;
                const user = req.user;
                const product = await this.productService.getProductById(parseInt(productId));
                if (!product)
                    return res.status(404).json({ message: '상품을 찾을수 없습니다.' });
                let isLiked = false;
                if (user) {
                    const like = await this.likeService.findLikeByUserIdAndProductId(user.id, parseInt(productId));
                    if (like) {
                        isLiked = true;
                    }
                }
                const responseProduct = { ...product, isLiked };
                res.status(200).json(responseProduct);
            }
            catch (error) {
                next(error);
            }
        };
        this.updateProduct = async (req, res, next) => {
            try {
                const { productId } = req.params;
                const { name, description, price } = req.body;
                const { user } = req;
                if (!user) {
                    return res.status(401).json({ message: '사용자 정보를 찾을 수 없습니다.' });
                }
                const product = await this.productService.getProductById(parseInt(productId));
                if (!product || product.userId !== user.id) {
                    return res.status(403).json({ message: '상품 수정 권한이 없습니다.' });
                }
                const updatedProduct = await this.productService.updateProduct(parseInt(productId), {
                    name,
                    description,
                    price,
                });
                res.status(200).json(updatedProduct);
            }
            catch (error) {
                next(error);
            }
        };
        this.deleteProduct = async (req, res, next) => {
            try {
                const { productId } = req.params;
                const { user } = req;
                if (!user) {
                    return res.status(401).json({ message: '사용자 정보를 찾을 수 없습니다.' });
                }
                const product = await this.productService.getProductById(parseInt(productId));
                if (!product || product.userId !== user.id) {
                    return res.status(403).json({ message: '상품 삭제 권한이 없습니다.' });
                }
                await this.productService.deleteProduct(parseInt(productId));
                res.status(204).send();
            }
            catch (error) {
                next(error);
            }
        };
        this.createComment = async (req, res, next) => {
            try {
                const { productId } = req.params;
                const { content } = req.body;
                const { user } = req;
                if (!user) {
                    return res.status(401).json({ message: '사용자 정보를 찾을 수 없습니다.' });
                }
                if (!content)
                    return res.status(400).json({ message: '댓글을 입력해주세요.' });
                const newComment = await this.commentService.createComment({
                    content,
                    productId: parseInt(productId),
                    userId: user.id,
                });
                res.status(201).json(newComment);
            }
            catch (error) {
                next(error);
            }
        };
        this.getComments = async (req, res, next) => {
            try {
                const { productId } = req.params;
                let cursor = req.query.cursor ? parseInt(req.query.cursor) : undefined;
                let limit = parseInt(req.query.limit) || 10;
                const comments = await this.commentService.getComments({
                    where: { productId: parseInt(productId) },
                    orderBy: { createdAt: 'desc' },
                    take: limit,
                    skip: cursor ? 1 : 0,
                });
                res.status(200).json(comments);
            }
            catch (error) {
                next(error);
            }
        };
        this.updateComment = async (req, res, next) => {
            try {
                const { commentId } = req.params;
                const { content } = req.body;
                const { user } = req;
                if (!user) {
                    return res.status(401).json({ message: '사용자 정보를 찾을 수 없습니다.' });
                }
                if (!content)
                    return res.status(400).json({ message: '수정할 내용을 입력해주세요.' });
                const existingComment = await this.commentService.getCommentById(parseInt(commentId));
                if (!existingComment || existingComment.userId !== user.id) {
                    return res.status(403).json({ message: '댓글 수정 권한이 없습니다.' });
                }
                const updatedComment = await this.commentService.updateComment(parseInt(commentId), {
                    content,
                });
                res.status(200).json(updatedComment);
            }
            catch (error) {
                next(error);
            }
        };
        this.deleteComment = async (req, res, next) => {
            try {
                const { commentId } = req.params;
                const { user } = req;
                if (!user) {
                    return res.status(401).json({ message: '사용자 정보를 찾을 수 없습니다.' });
                }
                const existingComment = await this.commentService.getCommentById(parseInt(commentId));
                if (!existingComment || existingComment.userId !== user.id) {
                    return res.status(403).json({ message: '댓글 삭제 권한이 없습니다.' });
                }
                await this.commentService.deleteComment(parseInt(commentId));
                res.status(204).send();
            }
            catch (error) {
                next(error);
            }
        };
        this.toggleLike = async (req, res, next) => {
            try {
                const { productId } = req.params;
                const { user } = req;
                if (!user) {
                    return res.status(401).json({ message: '사용자 정보를 찾을 수 없습니다.' });
                }
                const product = await this.productService.getProductById(parseInt(productId));
                if (!product) {
                    return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
                }
                const existingLike = await this.likeService.findLikeByUserIdAndProductId(user.id, parseInt(productId));
                if (existingLike) {
                    await this.likeService.deleteLike(existingLike.id);
                    res.status(200).json({ message: '상품 좋아요를 취소했습니다.' });
                }
                else {
                    await this.likeService.createLike({
                        userId: user.id,
                        productId: parseInt(productId),
                    });
                    res.status(201).json({ message: '상품에 좋아요를 눌렀습니다.' });
                }
            }
            catch (error) {
                next(error);
            }
        };
        this.productService = productService;
        const commentRepository = new CommentRepository_1.default();
        this.commentService = new CommentService_1.default(commentRepository);
        const likeRepository = new LikeRepository_1.default();
        this.likeService = new LikeService_1.default(likeRepository);
    }
}
exports.default = ProductsController;
