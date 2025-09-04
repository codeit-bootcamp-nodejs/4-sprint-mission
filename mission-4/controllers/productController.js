import {
  getProductService,
  getProductListService,
  postProductService,
  patchProductService,
  deleteProductService,
} from "../services/productService.js";

class ProductController {
  async getProduct(req, res) {
    const result = await getProductService({ id: req.parsedId });
    return res.status(200).json(result);
  }
  async getProductList(req, res) {
    const result = await getProductListService(req.parsedQuery);
    return res.status(200).json(result);
  }
  async postProduct(req, res) {
    const args = {
      userId: req.user.id,
      ...req.body,
    };
    const result = await postProductService(args);
    return res.status(201).json(result);
  }
  async patchProduct(req, res) {
    const args = {
      id: req.parsedId,
      data: req.body,
    };
    const result = await patchProductService(args);
    return res.status(200).json(result);
  }
  async deleteProduct(req, res) {
    const result = await deleteProductService({ id: req.parsedId });
    return res.status(200).json(result);
  }
}

export default new ProductController();
