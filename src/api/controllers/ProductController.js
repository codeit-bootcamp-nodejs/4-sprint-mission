import ProductService from "../services/ProductService.js";

const ProductController = {
  async createProduct(req, res, next) {
    try {
      const { id: userId } = req.user;
      const { name, description, price, tags } = req.body;
      const productData = { name, description, price, tags };
      const newProduct = await ProductService.createProduct(
        productData,
        userId
      );

      res.status(201).json(newProduct);
    } catch (err) {
      next(err);
    }
  },

  async findUniqueProduct(req, res, next) {
    try {
      //throw new Error("🔥에러 핸들러 테스트");
      const { id } = req.params;
      const product = await ProductService.findUniqueProduct(Number(id));

      if (!product) {
        return res.status(404).json({ error: "해당 상품을 찾을 수 없음" });
      }

      res.status(200).json(product);
    } catch (err) {
      next(err);
    }
  },

  async patchProduct(req, res, next) {
    try {
      const { id } = req.params;
      const { id: userId } = req.user;
      const updateData = req.body;

      const product = await ProductService.patchProduct(
        Number(id),
        updateData,
        userId
      );
      if (!product) {
        return res.status(404).json({ error: "수정할 상품이 없음" });
      }
      res.status(201).json(product);
    } catch (err) {
      next(err);
    }
  },

  async deleteProduct(req, res, next) {
    try {
      const { id } = req.params;
      const { id: userId } = req.user;
      await ProductService.deleteProduct(Number(id), userId);

      res.status(201).json({ success: "상품 삭제 성공" });
    } catch (err) {
      next(err);
    }
  },

  async findManyProduct(req, res, next) {
    try {
      const { offset = 0, limit = 10, order = "recent", keyword } = req.query;
      const products = await ProductService.findManyProduct({
        offset,
        limit,
        order,
        keyword,
      });
      res.status(200).json(products);
    } catch (err) {
      next(err);
    }
  },
};

export default ProductController;
