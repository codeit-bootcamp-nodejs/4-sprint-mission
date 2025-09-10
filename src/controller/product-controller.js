export class ProductController {
  constructor(productService) {
    this.productService = productService;
  }

  // 상품 등록
  createProduct = async (req, res, next) => {
    try {
      const { id: userId } = req.user; // req.user에서 userId 추출
      const { name, description, price, tags } = req.body;
      const newProduct = await this.productService.createProduct(
        userId, // userId 전달
        name,
        description,
        price,
        tags,
      );
      res.status(201).json(newProduct);
    } catch (error) {
      next(error);
    }
  };

  // 상품 목록 조회
  getProducts = async (req, res, next) => {
    try {
      const page = parseInt(req.query.page || '1');
      const limit = parseInt(req.query.limit || '10');
      const search = req.query.search;

      const products = await this.productService.getProducts(
        page,
        limit,
        search,
      );
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  };

  //  상품 상세 조회
  getProductById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const product = await this.productService.getProductById(id);
      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  };

  // 상품 수정
  updateProduct = async (req, res, next) => {
    try {
      const { id: userId } = req.user;
      const { id } = req.params;
      const productData = req.body;
      const updatedProduct = await this.productService.updateProduct(
        userId,
        id,
        productData,
      );
      res.status(200).json(updatedProduct);
    } catch (error) {
      next(error);
    }
  };

  // 상품 삭제
  deleteProduct = async (req, res, next) => {
    try {
      const { id: userId } = req.user;
      const { id } = req.params;
      await this.productService.deleteProduct(userId, id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  toggleLike = async (req, res, next) => {
    try {
      const { id: userId } = req.user;
      const { id: productId } = req.params;
      const result = await this.likeService.toggleProductLike(
        userId,
        parseInt(productId),
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
