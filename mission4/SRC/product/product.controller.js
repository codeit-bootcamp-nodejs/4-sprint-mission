
import { ProductService  } from "./product.service.js";
export class ProductController {
  constructor(){
    this.ps = ProductService
  }
  async getProductListController(req, res) {

    const { page, take, name, description, keyword } = req.query;
    const pageNumber = Number(page) || 1;
    const takeNumber = Number(take) || 10;

    if (isNaN(pageNumber) || isNaN(takeNumber))
      return res.status(400).json("페이지네이션은 정수 여야 합니다");
    if (name && typeof name !== "string")
      return res.status(400).json("name은 문자열이어야 합니다");
    if (description && typeof description !== "string")
      return res.status(400).json("description은 문자열이어야 합니다");
    try {
      const productList = await this.ps.getProductList(
        pageNumber,
        takeNumber,
        name,
        description,
        keyword
      );
      res.json(productList);
    } catch (error) {
      res.status(500).json({ error: "internal server error" });
      console.error(error.message);
    }
  }

  async getProductController(req, res) {
    try {
      const productId = Number(req.params.id);
      if (isNaN(productId))
        return res.status(400).json("페이지네이션은 정수 여야 합니다");
      const product = await this.ps.getProduct({ productId });      
      res.status(200).json({ message: "상품 조회 성공", data: product });
    } catch (error) {
      if (error.message === "존재하지 않는 상품입니다.") {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ error: "internal server error" });
      console.error(error.message);
    }
  }

  async createProductController(req, res) {
    //TODO:로그인한 유저만 상품을 등록 할수있다
    try {
      const { name, description, tags, price } = req.body;
      if (typeof name !== "string" || typeof description !== "string")
        return res.status(400).json("request 문자열이어야");
      if (!name || !description || !price || !tags)
        return res.status(400).json({ error: "게시글 등록 서버 문제" });
      const newProduct = await this.ps.createProduct({ name, description, tags, price });
      res.json(newProduct);
    } catch (error) {
      res.status(500).json({ error: "internal server error" });
      console.error(error.message);
    }
  }

  async deleteProductController(req, res) {
    // TODO:상품을 등록한 유저만 상품을 삭제 할수 있다
    try {
      const productId = Number(req.params.id);
      if (isNaN(productId))
        return res.status(400).json("페이지네이션은 정수 여야 합니다");
      const removed = await this.ps.deleteProduct(productId);
      res.json({ message: "삭제 완료", removed });
    } catch (error) {
      if (error.message === "존재하지 않는 상품입니다.") {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ error: "internal server error" });
      console.error(error.message);
    }
  }

  async modifiedProductController(req, res) {
    // TODO:상품을 등록한 유저만 상품을 수정 할수 있다
    try {
      const productId = Number(req.params.id);
      const { data } = req.body;
      if (isNaN(productId))
        return res.status(400).json("해당 제품의 인덱스는 정수 여야 합니다");
      const patchedProduct = await this.ps.modifiedProduct(productId, data);
      res.json({ message: "삭제 완료", patchedProduct });
    } catch (error) {
      if (error.message === "존재하지 않는 상품입니다.") {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ error: "internal server error" });
      console.error(error.message);
    }
  }
}
