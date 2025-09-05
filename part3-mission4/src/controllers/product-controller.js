import { productService } from '../services/product-service.js';

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

  // 유저 제품 목록 조회
  async getUserProducts(req, res) {
    const userId = req.user.id;
    const products = await productService.getUserProducts(userId);
    res.status(200).json({ products });
  }
}

export const productController = new ProductController();
