import { productService } from '../services/product-service.js';
import { commentService } from '../services/comment-service.js';

class ProductController {
  // 제품
  async getAllProducts(req, res) {
    const userId = req.user?.id || null;
    const { data, pagination } = await productService.getAllProducts(
      req.query,
      userId
    );
    res.json({ data, pagination });
  }

  async getProductById(req, res) {
    const { id } = req.params;
    const product = await productService.getProductById(id);
    res.json(product);
  }

  async createProduct(req, res) {
    const { name, description, price, tags } = req.body;
    const newProduct = await productService.createProduct(
      req.user.id,
      name,
      description,
      price,
      tags
    );
    res.status(201).json(newProduct);
  }

  async updateProduct(req, res) {
    const { id } = req.params;
    const { name, description, price, tags, images } = req.body;
    const updateData = { name, description, price, tags, images };
    const updated = await productService.updateProduct(
      id,
      req.user.id,
      updateData
    );
    res.json(updated);
  }

  async deleteProduct(req, res) {
    const { id } = req.params;
    await productService.deleteProduct(id, req.user.id);
    res.status(204).send();
  }

  async likeProduct(req, res) {
    const userId = req.user?.id;
    const productId = req.params.id;
    const product = await productService.productLike(userId, productId);
    res.json({ data: product });
  }

  async unlikeProduct(req, res) {
    const userId = req.user?.id;
    const productId = req.params.id;
    const product = await productService.productUnlike(userId, productId);
    res.json({ data: product });
  }

  // 댓글
  async getComments(req, res) {
    const { id } = req.params;
    const comments = await commentService.getCommentsByProductId(id);
    res.json(comments);
  }

  async createComment(req, res) {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id; // authenticate 미들웨어에서 가져옴
    const newComment = await commentService.createProductComment(
      id,
      content,
      userId
    );
    res.status(201).json(newComment);
  }

  async getCommentById(req, res) {
    console.log('CONTROLLER - req.params:', req.params);
    console.log('CONTROLLER - req.user:', req.user);
    const { id, commentId } = req.params;
    const comment = await commentService.getCommentByIdAndProductId(
      id,
      commentId
    );
    res.json(comment);
  }

  async updateComment(req, res) {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;
    const updated = await commentService.updateComment(
      commentId,
      userId,
      content
    );
    res.json(updated);
  }

  async deleteComment(req, res) {
    const { commentId } = req.params;
    const userId = req.user.id;
    await commentService.deleteComment(commentId, userId);
    res.status(204).send();
  }

  async likeComment(req, res) {
    const userId = req.user?.id;
    const { commentId } = req.params;
    const comment = await commentService.commentLike(userId, commentId);
    res.json({ data: comment });
  }

  async unlikeComment(req, res) {
    const userId = req.user?.id;
    const { commentId } = req.params;
    const comment = await commentService.commentUnlike(userId, commentId);
    res.json({ data: comment });
  }

  // 유저 제품 목록 조회
  async getUserProducts(req, res) {
    const userId = req.user.id;
    const products = await productService.getUserProducts(userId);
    res.status(200).json({ products });
  }
}

export const productController = new ProductController();
