import { Prisma } from '@prisma/client';
import express from 'express';
import z from 'zod';

const articleRouter = express.Router();

const createArticleSchema = z.object({
  title: z.string().min(1, { message: "제목을 입력해주세요" }),
  content: z.string().min(30, { message: "내용은 최소 30자 이상이어야 합니다." }).max(200, { message: "내용은 최대 200자까지 가능합니다." }),
});

articleRouter.route('/') //Article 등록하기
  .post(async(req, res) => {
    try {
     const validatedData = createArticleSchema.parse(req.body);    
    } catch (err) {
      res.status(404).json({ error: msg.error });
    };
   const { title, content } = validatedData;

    try {
        const article = await prisma.article.create({
            data: {
                title,
                content,
            },
        });
        res.json({ message: 'Complete to post your article!' });
    } catch (err) {
        res.status(500).json({ error: 'Article is not posted' });
    }
})

  .get(async(req, res) => { //검색어로 Article 조회 및 전체 Article 조회
    try {
      const keyword = req.query.keyword;
      const articles = await prisma.article.findMany({
        skip: (page - 1) * 5,
        take: 5,
        orderBy: {
          createdAt: 'asc',
        },
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
        },
        where: {
          OR: [
            {
              title: {
                contains: keyword,
              },
            },
            {
              content: {
                contains: keyword,
              },
            },
          ],
        },
      });
      res.status(201).json(articles);
    } catch (error) {
      console.error(error);
      res.status(404).json({ error: `Can't find articles`})
    }
  });

articleRouter.route('/:id')
  .patch(async(req, res) => { //id를 통해 Article 수정하기
    const articleId = Number(req.params.id);
    const { title, content } = req.body;

    try {
        const updated = await prisma.article.update({
            where: { id: articleId },
            data: {
                title,
                content,
            },
        });
        res.json({ message: 'Updated your article!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

  .delete(async(req, res) => { //id통해서 Article 삭제하기
     const articleId = Number(req.params.id);

    try {
        await prisma.article.delete({
            wehre: { id: articleId },
        });
        res.json({ message: 'Article is deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

  .get(async(req, res) => { //id를 통해서  Article 조회하기
    const articleId = Number(req.params.id);

    try {
      const article = await prisma.product.findUnique({
        where: { id: articleId },
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
        },
      });
      res.json(article);
    } catch (err) {
      res.status(404).json({ error: `Can't find article`})
    }
  });

export default articleRouter;
