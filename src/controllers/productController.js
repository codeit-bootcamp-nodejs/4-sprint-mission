import productService from '../services/productService';

const productController = {
  async createProduct(req, res, next) {
    try {
      const { name, description, price, tags } = req.body;
      const productData = { name, description, price, tags };
      const newProduct = await productService.createProduct(productData);
      res.status(201).json(newProduct);
    } catch (error) {
      next(error);
    }
  },

  async getProductById(req, res, next) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: '유효하지 않은 ID입니다.' });
      }
      const product = await productService.getProductById(id);
      if (!product) {
        return res
          .status(404)
          .json({ error: `${id}에 해당하는 상품을 찾을 수 없습니다` });
      }

      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  },

  async updateProduct(req, res, next) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: '유효하지 않은 ID입니다.' });
      }
      const { name, description, price, tags } = req.body;
      const productData = { name, description, price, tags };

      const productPatched = await productService.updateProduct(
        id,
        productData
      );

      res.status(200).json(productPatched);
    } catch (error) {
      next(error);
    }
  },

  async deleteProduct(req, res, next) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: '유효하지 않은 ID입니다.' });
      }

      const product = await productService.deleteProduct(id);
      res.status(200).json({ message: '상품을 삭제했습니다' });
    } catch (error) {
      next(error);
    }
  },

  async listProduct(req, res, next) {
    try {
      const page = Number(req.query.page) || 1;
      const pageSize = Number(req.query.pageSize) || 10;
      const keyword = req.query.keyword;
      const products = await productService.listProduct({
        page,
        pageSize,
        keyword,
      });

      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  },
};

export default productController;
