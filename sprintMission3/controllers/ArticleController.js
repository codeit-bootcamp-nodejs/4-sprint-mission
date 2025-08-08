import * as dotenv from 'dotenv';
import express, { application } from 'express';
import { PrismaClient } from '@prisma/client/extension';

dotenv.config();

const app = express();

const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// 게시글 등록
app.post('/articles', async (req, res) => {
  const { title, content } = req.body;
  try {
    const newArticle = await prisma.article.create({
      data: {
        title,
        content,
      },
    });
    res.status(201).json(newArticle);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '게시글 등록에 실패하였습니다.' });
  }
});

// 게시글 상세 조회
app.get('/articles/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const articles = await prisma.article.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    if (articles) {
      res.json(articles);
    } else {
      res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '게시글을 조회할 수 없습니다.' });
  }
});

// 게시글 수정
app.patch('articles/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  const dataToUpdate = {};
  if (title !== undefined) dataToUpdate.title = title;
  if (content !== undefined) dataToUpdate.content = content;

  try {
    const updateArticles = await prisma.article.update({
      where: {
        id: parseInt(id),
      },
      data: dataToUpdate,
    });
    res.json(updateArticles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '게시글을 수정할 수 없습니다.' });
  }
});

// 게시글 삭제
app.delete('/articles/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.article.delete({
      where: {
        id: parseInt(id),
      },
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '게시글을 삭제할 수 없습니다.' });
  }
});

// 게시글 목록 조회
app.get('/articles', async (req, res) => {
  const page = parseInt(req.query.page || '1');
  const limit = parseInt(req.query.limit || '10');
  const search = req.query.search;

  if (page < 1 || limit < 1) {
    return res.status(400).json({ error: '페이지 설정이 잘못되었습니다.' });
  }

  const offset = (page - 1) * limit;

  // 검색어가 있을 때 where 조건
  const whereCondition = search
    ? {
        OR: [
          { title: { contains: search } },
          { content: { contains: search } },
        ],
      }
    : {};

  try {
    const [articles, totalCont] = await prisma.article.$transaction([
      prisma.article.findMany({
        where: whereCondition,
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      prisma.article.count({ where: whereCondition }),
    ]);

    // 전체 페이지 수 계산
    const totalPages = Math.ceil(totalCont / limit);

    res.json({
      data: articles,
      pagination: {
        page,
        limit,
        totalCont,
        totalPages,
      },
    });
  } catch (error) {
    console.error(error);
  }
});
