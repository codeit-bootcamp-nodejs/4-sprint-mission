import express from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { CreateArticle, PatchArticle, ArticleComments, PatchArticleComment} from './zod.js';
import { ZodError } from 'zod';
import multer from 'multer';

const prisma = new PrismaClient();

const app = express();
app.use(express.json());

function asyncHandler(handler) {
  return async function (req, res, next) {
    try {
      await handler(req, res, next);
    }
    catch (e) {
      if (e instanceof ZodError) {
          res.status(400).json({ message: e.message, issues: e.errors });
        } else if (e.name === 'StructError' || 
                   e.name === 'ValidationError' ||
                   e instanceof Prisma.PrismaClientValidationError) {
        res.status(400).send({ message: e.message });
      } else if (
        e instanceof Prisma.PrismaClientKnownRequestError && 
        e.code === 'P2025') {
        res.status(404).send();
      } else {
        console.error(e);
        res.status(500).send({ message: 'Internal Server Error' });
      }
    }
  };
};

app.route('/articles')
.get(asyncHandler(async(req, res) => {
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
}))
.post(asyncHandler(async(req, res) => {
  const validated = CreateArticle.parse(req.body);
  const article = await prisma.article.create({
    data: validated,
  });
  res.status(201).send(article);
}))
.get(asyncHandler(async(req, res) => {
  const { limit = '10'} = req.query;
  const cursor = req.query.cursor ? { id: String(req.query.cursor) } : undefined;
  const articleComments = await prisma.articleComment.findMany({
    cursor,
    take: parseInt(limit, 10),
    select: {
        id: true,
        content: true,
        createdAt: true,
      }
  });
  res.status(200).send(articleComments);
}))
.post(asyncHandler(async(req, res) => {
  const validated = ArticleComment.parse(req.body);
  const articleComments = await prisma.articleComment.create({
    data: validated,
  });
  res.status(201).send(articleComments);
}))

app.route('/articles/:id')
.get(asyncHandler(async(req, res) => {
  const article = await prisma.article.findUnique({
    where: { id: Number(req.params.id) },
  });
  if (!article) {
    return res.status(404).send();
  }
  res.status(200).send(article);
}))
.patch(asyncHandler(async(req, res) => {
  const validated = PatchArticle.parse(req.body);
  const article = await prisma.article.update({
    where: { id: Number(req.params.id) },
    data: validated,
  });
  res.status(200).send(article);
}))
.delete(asyncHandler(async(req, res) => {
  await prisma.article.delete({
    where: { id: Number(req.params.id) },
  });
  res.status(204).send();
}))
.patch(asyncHandler(async(req, res) => {
  const validated = PatchArticleComment.parse(req.body);
  const articleComments = await prisma.articleComment.update({
    where: { id: Number(req.params.id) },
    data: validated,
  });
  res.status(200).send(articleComments);
}))
.delete(asyncHandler(async(req, res) => {
  await prisma.articleComment.delete({
    where: { id: Number(req.params.id) },
  });
  res.status(204).send();
}));


const uploads = multer({ dest: 'uploads/articles' });

app.post('/articles/files', uploads.single('file'), asyncHandler(async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send({ message: 'No file uploaded' });
  }
  res.status(201).send({ message: 'File uploaded successfully', file });
}));




app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});