import ProductService from "../services/ProductService.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

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
      const productId = Number(id);

      let userId = null;
      const token = req.cookies.accessToken;

      if (token) {
        try {
          const decoded = jwt.verify(token, JWT_SECRET);
          userId = decoded.userId;
        } catch (err) {
          console.error("토큰 검증 오류:", err);
        }
      }

      const product = await ProductService.findUniqueProduct(productId, userId);
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
