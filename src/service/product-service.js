export class ProductService {
  // 생성자에서 ProductRepository와 prisma 클라이언트를 주입받습니다.
  constructor(productRepository, prisma) {
    this.productRepository = productRepository;
    this.prisma = prisma;
  }

  // 상품 생성

  createProduct = async (userId, name, description, price, tags) => {
    return await this.productRepository.createProduct(
      userId,
      name,
      description,
      price,
      tags,
    );
  };

  // 상품 목록 조회

  getProducts = async (page, limit, search, userId) => {
    // userId 파라미터 추가
    const whereCondition = search
      ? {
          OR: [
            { name: { contains: search } },
            { description: { contains: search } },
          ],
        }
      : {};
    const offset = (page - 1) * limit;

    // 레포지토리로 userId 전달
    const products = await this.productRepository.findManyProducts(
      whereCondition,
      offset,
      limit,
      userId,
    );
    const totalCount =
      await this.productRepository.countProducts(whereCondition);
    const totalPages = Math.ceil(totalCount / limit);

    return {
      data: products,
      pagination: { page, limit, totalCount, totalPages },
    };
  };

  // 상품 상세 조회
  getProductById = async (productId, userId) => {
    // userId 파라미터 추가
    const product = await this.productRepository.findProductById(
      productId,
      userId,
    ); // 레포지토리로 userId 전달
    if (!product) {
      throw new Error('상품을 찾을 수 없습니다.');
    }
    return product;
  };

  updateProduct = async (userId, productId, productData) => {
    const product = await this.productRepository.findProductById(productId);
    if (!product) {
      throw new Error('상품을 찾을 수 없습니다.');
    }
    // 권한 확인
    if (product.userId !== userId) {
      throw new Error('상품을 수정할 권한이 없습니다.');
    }

    const { name, description, price, tags } = productData;
    const dataToUpdate = {};
    if (name !== undefined) dataToUpdate.name = name;
    if (description !== undefined) dataToUpdate.description = description;
    if (price !== undefined) dataToUpdate.price = price;
    if (tags !== undefined) dataToUpdate.tags = tags;

    return await this.productRepository.updateProduct(productId, dataToUpdate);
  };

  // 상품 삭제
  deleteProduct = async (userId, productId) => {
    const product = await this.productRepository.findProductById(productId);
    if (!product) {
      throw new Error('상품을 찾을 수 없습니다.');
    }
    // 권한 확인
    if (product.userId !== userId) {
      throw new Error('상품을 삭제할 권한이 없습니다.');
    }
    await this.productRepository.deleteProduct(productId);
  };
}
