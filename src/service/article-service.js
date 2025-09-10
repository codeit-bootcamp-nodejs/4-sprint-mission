export class ArticleService {
  constructor(articleRepository, prisma) {
    this.articleRepository = articleRepository;
    this.prisma = prisma;
  }

  // 게시글 생성

  createArticle = async (userId, title, content) => {
    return await this.articleRepository.createArticle(userId, title, content);
  };

  // 게시글 목록 조회
  getArticles = async (page, limit, search) => {
    const whereCondition = search
      ? {
          OR: [
            { title: { contains: search } },
            { content: { contains: search } },
          ],
        }
      : {};

    const offset = (page - 1) * limit;

    const [articles, totalCount] = await this.prisma.$transaction(
      async (tx) => {
        const articles = await this.articleRepository.findManyArticles(
          whereCondition,
          offset,
          limit,
          tx,
        );
        const totalCount = await this.articleRepository.countArticles(
          whereCondition,
          tx,
        );
        return [articles, totalCount];
      },
    );

    const totalPages = Math.ceil(totalCount / limit);

    return {
      data: articles,
      pagination: { page, limit, totalCount, totalPages },
    };
  };

  // 게시글 상세 조회
  getArticleById = async (articleId) => {
    const article = await this.articleRepository.findArticleById(articleId);
    if (!article) {
      throw new Error('게시글을 찾을 수 없습니다.');
    }
    return article;
  };

  // 게시글 수정
  updateArticle = async (userId, articleId, articleData) => {
    const article = await this.articleRepository.findArticleById(articleId);
    if (!article) {
      throw new Error('게시글을 찾을 수 없습니다.');
    }
    if (article.userId !== userId) {
      throw new Error('게시글을 수정할 권한이 없습니다.');
    }

    const { title, content } = articleData;
    const dataToUpdate = {};
    if (title !== undefined) dataToUpdate.title = title;
    if (content !== undefined) dataToUpdate.content = content;

    return await this.articleRepository.updateArticle(articleId, dataToUpdate);
  };

  // 게시글 삭제
  deleteArticle = async (userId, articleId) => {
    const article = await this.articleRepository.findArticleById(articleId);
    if (!article) {
      throw new Error('게시글을 찾을 수 없습니다.');
    }
    if (article.userId !== userId) {
      throw new Error('게시글을 삭제할 권한이 없습니다.');
    }
    await this.articleRepository.deleteArticle(articleId);
  };
}
