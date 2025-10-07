import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

class ArticleService {
  async getAllArticles(query) {
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
          { title: { contains: keyword, mode: 'insensitive' } },
          { content: { contains: keyword, mode: 'insensitive' } },
        ],
      };
    }
    const articles = await prisma.article.findMany({
      skip,
      take: limit,
      where, // 검색 조건 적용
      orderBy, // 정렬 조건 적용
      select: {
        id: true,
        title: true,
        content: true,
        author: true,
        createdAt: true,
      },
    });

    const totalArticles = await prisma.article.count({ where }); // 검색 조건에 맞는 총 게시글 수
    const totalPages = Math.ceil(totalArticles / limit);

    return {
      data: articles,
      pagination: {
        totalArticles,
        totalPages,
        currentPage: page,
        limit,
      },
    };
  }
  async getArticleById(id) {
    const article = await prisma.article.findUnique({
      where: { id: parseInt(id) },
    });
    if (!article) {
      throw new Error('존재하지 않는 게시글입니다.');
    }
    return article;
  }

  async createArticle(title, content, author) {
    return prisma.article.create({
      data: {
        title,
        content,
        author,
      },
    });
  }

  async updateArticle(id, updateData) {
    return prisma.article.update({
      where: { id: parseInt(id) },
      data: updateData,
    });
  }

  async deleteArticle(id) {
    return prisma.article.delete({
      where: { id: parseInt(id) },
    });
  }
}

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
    });
  }

  async deleteProduct(id) {
    return prisma.product.delete({
      where: { id: parseInt(id) },
    });
  }
}

class CommentService {
  async getCommentsByArticleId(id) {
    return prisma.comment.findMany({
      where: {
        articleId: parseInt(id),
      },
      select: {
        id: true,
        content: true,
        author: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getCommentsByProductId(id) {
    return prisma.comment.findMany({
      where: {
        productId: parseInt(id),
      },
      select: {
        id: true,
        content: true,
        author: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getCommentByIdAndArticleId(id, commentId) {
    return prisma.comment.findUnique({
      where: {
        id: parseInt(commentId),
        articleId: parseInt(id),
      },
      select: {
        id: true,
        content: true,
        author: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getCommentByIdProductId(id, commentId) {
    return prisma.comment.findUnique({
      where: {
        id: parseInt(commentId),
        productId: parseInt(id),
      },
      select: {
        id: true,
        content: true,
        author: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async createArticleComment(id, content) {
    return prisma.comment.create({
      data: {
        content,
        article: {
          connect: { id: parseInt(id) },
        },
      },
    });
  }

  async createProductComment(id, content) {
    return prisma.comment.create({
      data: {
        content,
        product: {
          connect: { id: parseInt(id) },
        },
      },
    });
  }

  async updateComment(commentId, content) {
    return prisma.comment.update({
      where: { id: parseInt(commentId) },
      data: { content },
    });
  }

  async deleteComment(commentId) {
    return prisma.comment.delete({
      where: { id: parseInt(commentId) },
    });
  }
}

export const articleService = new ArticleService();
export const productService = new ProductService();
export const commentService = new CommentService();
