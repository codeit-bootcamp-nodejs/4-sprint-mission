import { PrismaClient } from '@prisma/client';
import express from 'express';
import  { z } from 'zod';

const articleRouter = express.Router();

const prisma = new PrismaClient();

const schema = z.object({ //유효성 검사 설정하기
  title: z.string().min(1, { message: "제목을 입력해주세요" }),
  content: z.string().min(10, { message: "내용은 최소 10자 이상이어야 합니다." }).max(200, { message: "내용은 최대 200자까지 가능합니다." }),
});

articleRouter.route('/') // Zod로 유효성 검사에서 통과한 데이터를 article table에 post하기
  .post(async(req, res, next) => {
    try {
      const validatedData = schema.parse(req.body);
      const article = await prisma.article.create({
            data: {
                title: validatedData.title,
                content: validatedData.content,
            },
      });

      return res.status(201).json(article);
    } catch (err) {
        next(err);
    }
})

  .get(async(req, res, next) => { //page와 keyword query를 통해서 원하는 article 찾기
    try {
      const page = parseInt(req.query.page) || 1;
      const keyword = req.query.keyword || '';
      const where = keyword //title과 content 에서 원하는 keyword가 있는 데이터를 찾도록 만든 변수
      ? {
          OR: [
            {
              title: {
                contains: keyword,
                mode: 'insensitive', //대소문자 구분 없이 검색하기 위해
              },
            },
            {
              content: {
                contains: keyword,
                mode: 'insensitive',
              },
            },
          ],
        }
      : {}; //기본값 {}으로 빈 객체를 수식하기 위함

      const articles = await prisma.article.findMany({
        skip: (page - 1) * 5, //offset pagination
        take: 5,
        orderBy: { // 최신 순서대로 정렬하기(최신순)
          createdAt: 'desc',
        },
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
        },
        where,
      });

      res.status(200).json(articles);
    } catch (error) {
        next(err);
    }
  });

articleRouter.route('/:id')
  .patch(async(req, res, next) => { // Id를 통해서 article를 찾아내 수정하기
    const articleId = Number(req.params.id);
    const validatedData = schema.parse(req.body);

    try {
        const updated = await prisma.article.update({
            where: { id: articleId },
            data: {
                title: validatedData.title,
                content: validatedData.content,
            },
        });
        res.status(200).json(updated);
    } catch (err) {
        next(err);
    }
})

  .delete(async(req, res, next) => { // Id을 통해 article를 찾아내 삭제하기
     const articleId = Number(req.params.id);

    try {
        await prisma.article.delete({
            where: { id: articleId },
        });
        res.status(204).end();
    } catch (err) {
        next(err);
    }
})

  .get(async(req, res, next) => { //id를 통해  article 조회하기
    const articleId = Number(req.params.id);

    try {
      const article = await prisma.article.findUnique({
        where: { id: articleId },
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
        },
      });
      if (!article) {
        return res.status(404).json({ error: 'Article not found'});
      }
      res.status(200).json(article);
    } catch (err) {
        next(err);
    }
  });


  articleRouter.use((err, req, res, next) => { //에러 미드웨어 설정
    if (err instanceof z.ZodError) {
        return res.status(400).json({ error: err.errors });
    }

    if (err.code === 'P2025') {
        return res.status(404).json({ error: 'Record not found' });
    }

    console.error('unhandled Error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  });


export default articleRouter;
