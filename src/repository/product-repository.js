export class ProductRepository {
  // 생성자를 통해 prisma 클라이언트 인스턴스를 주입받습니다.
  constructor(prisma) {
    this.prisma = prisma;
  }

  /**
   * 새로운 상품을 생성합니다.
   * @param {string} name - 상품 이름
   * @param {string} description - 상품 설명
   * @param {number} price - 상품 가격
   * @param {string[]} tags - 상품 태그
   * @returns {Promise<object>} 생성된 상품 객체
   */
  createProduct = async (name, description, price, tags) => {
    return await this.prisma.product.create({
      data: { name, description, price, tags },
    });
  };

  /**
   * 조건에 맞는 상품 목록을 조회합니다.
   * @param {object} whereCondition - Prisma 조회 조건
   * @param {number} offset - 페이지네이션 offset
   * @param {number} limit - 페이지당 아이템 수
   * @param {object} [tx] - (선택) 트랜잭션용 Prisma 클라이언트
   * @returns {Promise<Array<object>>} 상품 목록
   */
  findManyProducts = async (whereCondition, offset, limit, tx) => {
    const prismaClient = tx || this.prisma;
    return await prismaClient.product.findMany({
      where: whereCondition,
      select: { id: true, name: true, price: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit,
    });
  };

  /**
   * 조건에 맞는 상품의 전체 개수를 조회합니다.
   * @param {object} whereCondition - Prisma 조회 조건
   * @param {object} [tx] - (선택) 트랜잭션용 Prisma 클라이언트
   * @returns {Promise<number>} 상품 전체 개수
   */
  countProducts = async (whereCondition, tx) => {
    const prismaClient = tx || this.prisma;
    return await prismaClient.product.count({ where: whereCondition });
  };

  /**
   * ID로 특정 상품을 조회합니다.
   * @param {number} productId - 상품 ID
   * @returns {Promise<object|null>} 조회된 상품 객체
   */
  findProductById = async (productId) => {
    return await this.prisma.product.findUnique({
      where: { id: parseInt(productId) },
    });
  };

  /**
   * 특정 상품의 정보를 수정합니다.
   * @param {number} productId - 상품 ID
   * @param {object} dataToUpdate - 수정할 데이터
   * @returns {Promise<object>} 수정된 상품 객체
   */
  updateProduct = async (productId, dataToUpdate) => {
    return await this.prisma.product.update({
      where: { id: parseInt(productId) },
      data: dataToUpdate,
    });
  };

  /**
   * 특정 상품을 삭제합니다.
   * @param {number} productId - 상품 ID
   * @returns {Promise<void>}
   */
  deleteProduct = async (productId) => {
    await this.prisma.product.delete({
      where: { id: parseInt(productId) },
    });
  };
}
