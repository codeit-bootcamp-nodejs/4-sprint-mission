export class ProductService {
  // 생성자에서 ProductRepository와 prisma 클라이언트를 주입받습니다.
  constructor(productRepository, prisma) {
    this.productRepository = productRepository;
    this.prisma;
  }

  // 상품 생성

  createProduct = async (name, description, price, tags) => {
    return await this.productRepository.createProduct(
      name,
      description,
      price,
      tags,
    );
  };

  // 상품 목록 조회

  getProducts = async (page, limit, search) => {
    const whereCondition = search
      ? {
          OR: [
            { name: { contains: search } },
            { description: { contains: search } },
          ],
        }
      : {};

    const offset = (page - 1) * limit;

    const [products, totalCount] = await prisma.$transaction(async (tx) => {
      const products = await this.productRepository.findManyProducts(
        whereCondition,
        offset,
        limit,
        tx,
      );
      const totalCount = await this.productRepository.countProducts(
        whereCondition,
        tx,
      );
      return [products, totalCount];
    });

    const totalPages = Math.ceil(totalCount / limit);

    return {
      data: products,
      pagination: { page, limit, totalCount, totalPages },
    };
  };

  // 상품 상세 조회
  getProductById = async (productId) => {
    const product = await this.productRepository.findProductById(productId);
    if (!product) {
      throw new Error('상품을 찾을 수 없습니다.'); // 에러 처리 로직 추가
    }
    return product;
  };

  // 상품 수정
  updateProduct = async (productId, productData) => {
    // 수정 전 상품이 존재하는지 확인
    await this.getProductById(productId);

    const { name, description, price, tags } = productData;
    const dataToUpdate = {};
    if (name !== undefined) dataToUpdate.name = name;
    if (description !== undefined) dataToUpdate.description = description;
    if (price !== undefined) dataToUpdate.price = price;
    if (tags !== undefined) dataToUpdate.tags = tags;

    return await this.productRepository.updateProduct(productId, dataToUpdate);
  };

  // 상품 삭제

  deleteProduct = async (productId) => {
    // 삭제 전 상품이 존재하는지 확인
    await this.getProductById(productId);
    await this.productRepository.deleteProduct(productId);
  };
}
