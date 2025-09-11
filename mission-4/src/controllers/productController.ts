import {
  getProductService,
  getProductListService,
  postProductService,
  patchProductService,
  deleteProductService,
  postProductLikeService,
  deleteProductLikeService,
} from '../services/productService.js';

class ProductController {
  async getProduct(req, res) {
    const { id: productId } = req.parsedId;
    const { id: userId } = req.tokenPayload || {};
    const result = await getProductService({ userId, productId });
    return res.status(200).json(result);
  }
  async getProductList(req, res) {
    const { id: userId } = req.tokenPayload || {};
    const result = await getProductListService({ userId, ...req.parsedQuery });
    return res.status(200).json(result);
  }
  async postProduct(req, res) {
    const { id: userId } = req.tokenPayload;
    const result = await postProductService({ userId, ...req.body });
    return res.status(201).json(result);
  }
  async patchProduct(req, res) {
    const id = req.parsedId;
    const data = req.body;
    const result = await patchProductService({ id, data });
    return res.status(200).json(result);
  }
  async deleteProduct(req, res) {
    const result = await deleteProductService({ id: req.parsedId });
    return res.status(200).json(result);
  }
  async postProductLike(req, res) {
    const { id: productId } = req.parsedId;
    const { id: userId } = req.tokenPayload;
    const result = await postProductLikeService({ userId, productId });
    return res.status(201).json(result);
  }
  async deleteProductLike(req, res) {
    const { id: productId } = req.parsedId;
    const { id: userId } = req.tokenPayload;
    const result = await deleteProductLikeService({ userId, productId });
    return res.status(200).json(result);
  }
}

export default new ProductController();
