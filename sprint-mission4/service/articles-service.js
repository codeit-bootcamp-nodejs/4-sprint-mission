import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getArticles = async(req, res) => {
  const { offset = '0', limit = '10', order = 'newest', search } = req.query;
  let orderBy;
  switch (order) {
    case 'oldest':
      orderBy = { createdAt: 'asc' };
      break;
    case 'newest':
    default:
      orderBy = {createdAt: 'desc'};
  }
  const where = search ? {
    OR: [{ title: { contains: String(search), mode: 'insensitive' } },
    { content: { contains: String(search), mode: 'insensitive' } }
    ]
  } : {};
  const articles = await prisma.article.findMany({
    where,
    orderBy,
    skip: parseInt(offset, 10),
    take: parseInt(limit, 10),
    select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
      }
  });
  res.status(200).send(articles);
};

const createArticles = async(req, res) => {
  const userId = req.user.userId;
  const { title, content } = req.body;
  const articleData = {
    title,
    content,
    userId, // JWT에서 추출한 userId를 article 데이터에 추가
    };
  const article = await prisma.article.create({
    data: articleData
  });
  res.status(201).send(article);
};

const getArticleById = async(req, res) => {
  const article = await prisma.article.findUnique({
    where: { id: Number(req.params.articleId) },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      }
  });
  res.status(200).send(article);
};

const updateArticles = async(req, res) => {
  const article = await prisma.article.update({
    where: { id: Number(req.params.articleId) },
    data: req.body,
  });
  res.status(200).send(article);
}

const deleteArticles = async(req, res) => {
  await prisma.article.delete({
    where: { id: Number(req.params.articleId) },
  });
  res.status(204).send();
}

const getArticleComments = async(req, res) => {
  const articleComments = await prisma.articleComment.findMany({
    where: { articleId: Number(req.params.articleId) },
  });
  res.status(200).send(articleComments);
}

const createArticleComment = async(req, res) => {
  const userId = req.user.userId;
  const articleId = parseInt(req.params.articleId, 10);
  const articleComments = await prisma.articleComment.create({
    data: {
      content: req.body.content,
      article: { connect: { id: articleId } },
      user: { connect: { id: userId } },
    }
  });
  res.status(201).send(articleComments);
}

const updateArticleComment = async(req, res) => {
  const articleComments = await prisma.articleComment.update({
    where: { id: Number(req.params.articleCommentId) },
    data: req.body,
  });
  res.status(200).send(articleComments);
}

const deleteArticleComment = async(req, res) => {
  const articleComments = await prisma.articleComment.delete({
    where: { id: Number(req.params.articleCommentId) },
  });
  res.status(204).send(articleComments);
}

export default { 
  getArticles, 
  createArticles, 
  getArticleById, 
  updateArticles, 
  deleteArticles,
  getArticleComments,
  createArticleComment,
  updateArticleComment,
  deleteArticleComment
};