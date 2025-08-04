import ProductDbService from "../services/ProductDbService.js";

const ProductController = {
  async createProduct(req, res) {
    try {
      const { name, description, price, tags } = req.body;

      if (!name || !price) {
        return res
          .status(400)
          .json({ error: "상품 이름과 가격은 필수값입니다." });
      }

      const productData = { name, description, price, tags };
      const newProduct = await ProductDbService.createProduct(productData);

      res.status(201).json(newProduct);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "상품 등록 실패" });
    }
  },

  async findUniqueProduct(req, res) {
    try {
      const { id } = req.params;
      const product = await ProductDbService.findUniqueProduct(Number(id));

      res.status(201).json(product);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "상품 조회 실패" });
    }
  },

  async patchProduct(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const product = await ProductDbService.patchProduct(
        Number(id),
        updateData
      );
      res.status(201).json(product);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "상품 수정 실패" });
    }
  },

  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const bool = await ProductDbService.deleteProduct(Number(id));

      res.status(201).json(bool);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "상품 삭제 실패" });
    }
  },

  async findManyProduct(req, res) {
    try {
      const products = await ProductDbService.findManyProduct();
      res.status(201).json(products);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "상품 목록 조회 실패" });
    }
  },
};

export default ProductController;
