import { PrismaClient } from '@prisma/client/extension';

const prisma = new PrismaClient();

export const createArticle = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const newArticle = await prisma.article.create({
      data: { title, content },
    });
    res.status(201).json(newArticle);
  } catch (error) {
    next(error); // 에러를 다음 미들웨어(에러 핸들러)로 전달
  }
};

// 게시글 목록 조회
export const getArticles = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '10');
    const search = req.query.search;

    if (page < 1 || limit < 1) {
      return res.status(400).json({ error: '페이지 설정이 잘못되었습니다.' });
    }

    const offset = (page - 1) * limit;
    const whereCondition = search
      ? {
          OR: [
            { title: { contains: search } },
            { content: { contains: search } },
          ],
        }
      : {};

    const [articles, totalCount] = await prisma.$transaction([
      prisma.article.findMany({
        where: whereCondition,
        select: { id: true, title: true, content: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      prisma.article.count({ where: whereCondition }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      data: articles,
      pagination: { page, limit, totalCount, totalPages },
    });
  } catch (error) {
    next(error);
  }
};

// 게시글 상세 조회
export const getArticleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const article = await prisma.article.findUnique({
      where: { id: parseInt(id) },
    });
    if (article) {
      res.json(article);
    } else {
      res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
    }
  } catch (error) {
    next(error);
  }
};

// 게시글 수정
export const updateArticle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const dataToUpdate = {};
    if (title !== undefined) dataToUpdate.title = title;
    if (content !== undefined) dataToUpdate.content = content;

    const updatedArticle = await prisma.article.update({
      where: { id: parseInt(id) },
      data: dataToUpdate,
    });
    res.json(updatedArticle);
  } catch (error) {
    next(error);
  }
};

// 게시글 삭제
export const deleteArticle = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.article.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
