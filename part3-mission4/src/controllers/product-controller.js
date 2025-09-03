import { productService } from '../services/product-service.js';
import { commentService } from '../services/comment-service.js';

class ProductController {
  // 제품
  async getAllProducts(req, res) {
    const { data, pagination } = await productService.getAllProducts(req.query);
    res.json({ data, pagination });
  }

  async createProduct(req, res) {
    const { name, description, price, tags } = req.body;
    const newProduct = await productService.createProduct(
      name,
      description,
      price,
      tags
    );
    res.status(201).json(newProduct);
  }

  async getProductById(req, res) {
    const { id } = req.params;
    const product = await productService.getProductById(id);
    res.json(product);
  }

  async updateProduct(req, res) {
    const { id } = req.params;
    const { name, description, price, tags, images } = req.body;
    const updateData = { name, description, price, tags, images };
    const updated = await productService.updateProduct(id, updateData);
    res.json(updated);
  }

  async deleteProduct(req, res) {
    const { id } = req.params;
    await productService.deleteProduct(id);
    res.status(204).send();
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
    const newComment = await commentService.createProductComment(id, content);
    res.status(201).json(newComment);
  }

  async getCommentById(req, res) {
    const { id, commentId } = req.params;
    const comment = await commentService.getCommentByIdProductId(id, commentId);
    res.json(comment);
  }

  async updateComment(req, res) {
    const { commentId } = req.params;
    const { content } = req.body;
    const updated = await commentService.updateComment(commentId, content);
    res.json(updated);
  }

  async deleteComment(req, res) {
    const { commentId } = req.params;
    await commentService.deleteComment(commentId);
    res.status(204).send();
  }
}

export const productController = new ProductController();
