import prisma from '../lib/prismaClient.js';

class ProductService {
  async getAllProducts(query) {
    const page = parseInt(query.page) || 1; // 페이지
    const limit = parseInt(query.limit) || 10; // 노출 항목
    const sort = query.sort || 'recent'; // 정렬 설정
    const keyword = query.keyword || ''; // 키워드 설정
    const skip = (page - 1) * limit; // 넘길 항목수

    let orderBy;
    switch (sort) {
      case 'recect':
        orderBy = { createdAt: 'desc' };
        break;
      case 'old':
        orderBy = { createdAt: 'asc' };
        break;
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }

    let where;

    if (keyword) {
      where = {
        OR: [
          { name: { contains: keyword, mode: 'insensitive' } },
          { description: { contains: keyword, mode: 'insensitive' } },
        ],
      };
    }
    const products = await prisma.product.findMany({
      skip,
      take: limit,
      where, // 검색 조건 적용
      orderBy, // 정렬 조건 적용
      select: {
        id: true,
        name: true,
        price: true,
        createdAt: true,
      },
    });

    const totalProducts = await prisma.product.count({ where }); // 검색 조건에 맞는 총 게시글 수
    const totalPages = Math.ceil(totalProducts / limit);

    return {
      data: products,
      pagination: {
        totalProducts,
        totalPages,
        currentPage: page,
        limit,
      },
    };
  }

  async getProductById(id) {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });
    if (!product) {
      throw new Error('존재하지 않는 상품입니다.');
    }
    return product;
  }

  async createProduct(name, description, price, tags) {
    return prisma.product.create({
      data: {
        name,
        description,
        price,
        tags,
      },
    });
  }

  async updateProduct(id, updateData) {
    return prisma.product.update({
      where: { id: parseInt(id) },
      data: updateData,
      select: {
        name: true,
        description: true,
        price: true,
        tags: true,
        images: true,
      },
    });
  }

  async deleteProduct(id) {
    return prisma.product.delete({
      where: { id: parseInt(id) },
    });
  }
}

export const productService = new ProductService();
