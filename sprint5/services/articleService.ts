import prisma from "../lib/prisma.js";
interface Article {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
}

interface ArticleWithLike extends Article {
  isLiked: boolean;
}

export const getArticles = async (
  offset: number,
  limit: number,
  title: string | undefined,
  content: string | undefined,
  userId: number | null
): Promise<ArticleWithLike[]> => {
  try {
    const filter = [];

    if (title) {
      filter.push({ title: { contains: title } });
    }

    if (content) {
      filter.push({ content: { contains: content } });
    }

    const where = filter.length > 0 ? { OR: filter } : {};

    const articles = await prisma.article.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: limit,
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
      },
    });

    if (!userId) {
      return articles.map((article) => ({ ...article, isLiked: false }));
    }

    const likedArticles = await prisma.like.findMany({
      where: {
        userId,
        articleId: { in: articles.map((p) => p.id) },
      },
      select: {
        articleId: true,
      },
    });

    const likedArticleIds = new Set(likedArticles.map((lp) => lp.articleId));

    return articles.map((article) => ({
      ...article,
      isLiked: likedArticleIds.has(article.id),
    }));
  } catch (err) {
    throw err;
  }
};

export const createArticle = async (
  title: string,
  content: string,
  userId: number
): Promise<Article> => {
  try {
    const article = await prisma.article.create({
      data: {
        title,
        content,
        userId,
      },
    });

    return article;
  } catch (err) {
    throw err;
  }
};

export const findArticleById = async (
  id: number,
  userId: number | null
): Promise<ArticleWithLike> => {
  try {
    const article = await prisma.article.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
      },
    });

    if (!article) {
      const error: HttpError = new Error("게시글을 찾을 수 없습니다.");
      error.status = 404;
      throw error;
    }

    let isLiked: boolean = false;
    if (userId) {
      const like = await prisma.like.findUnique({
        where: {
          userId_articleId: {
            userId,
            articleId: id,
          },
        },
      });
      isLiked = !!like; // like가 있으면 true, 없으면 false
    }

    return { ...article, isLiked };
  } catch (err) {
    throw err;
  }
};

export const updateArticle = async (
  id: number,
  title: string | undefined,
  content: string | undefined,
  userId: number
): Promise<Article> => {
  try {
    const articleData: { title?: string; content?: string } = {};

    if (title !== undefined) {
      articleData.title = title;
    }
    if (content !== undefined) {
      articleData.content = content;
    }

    const article = await prisma.article.findUnique({ where: { id } });

    if (!article) {
      const error: HttpError = new Error("게시글을 찾을 수 없습니다.");
      error.status = 404;
      throw error;
    }

    if (article.userId != userId) {
      const error: HttpError = new Error("게시글을 수정할 권한이 없습니다.");
      error.status = 403;
      throw error;
    }

    const updatedArticle = await prisma.article.update({
      where: { id },
      data: articleData,
    });

    return updatedArticle;
  } catch (err) {
    throw err;
  }
};

export const removeArticle = async (
  id: number,
  userId: number
): Promise<void> => {
  try {
    const article = await prisma.article.findUnique({ where: { id } });

    if (!article) {
      const error: HttpError = new Error("게시글을 찾을 수 없습니다.");
      error.status = 404;
      throw error;
    }

    if (article.userId != userId) {
      const error: HttpError = new Error("게시글을 삭제할 권한이 없습니다.");
      error.status = 403;
      throw error;
    }

    await prisma.article.delete({ where: { id } });
  } catch (err) {
    throw err;
  }
};
