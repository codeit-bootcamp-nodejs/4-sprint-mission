import prisma from '../lib/prismaClient.js';

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
      select: {
        title: true,
        content: true,
        tags: true,
      },
    });
  }

  async deleteArticle(id) {
    return prisma.article.delete({
      where: { id: parseInt(id) },
    });
  }
}

export const articleService = new ArticleService();
