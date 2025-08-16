import express from 'express';
import prisma from '../client/prismaClient.js'


const router = express.Router();

//////////////////////////////////////////////////////////////성공

/////////////////////////////////////////////////////////
//  - offset 방식의 페이지네이션 기능을 포함해 주세요.(쿼리파라미터 offset=1 & lim)
// - 최신순(`recent`)으로 정렬할 수 있습니다.
//  - `name`, `description`에 포함된 단어로 검색할 수 있습니다.

router.get('/', async (req, res) => {
  const { order = 'asc', page = 0, pageSize = 5, keyword = '' } = req.query;
  console.log(req.query.order);

  let orderBy;
  if (order === 'recent') {
    orderBy = 'desc';
  } else if (order === 'oldest') {
    orderBy = 'asc';
  } else {
    orderBy = order;
  }

  const whereClause = keyword
    ? {
        OR: [
          { name: { contains: keyword, mode: 'insensitive' } },
          { description: { contains: keyword, mode: 'insensitive' } },
        ],
      }
    : {};

  const article = await prisma.article.findMany({
    where: whereClause,
    orderBy: {
      createdAt: orderBy,
    },
    skip: parseInt((page - 1) * pageSize),
    take: parseInt(pageSize),

    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
    },
  });
  res.status(200).json(article);
});
////////////////////////////////////////////////////////////////
router.get('/:aid', async (req, res) => {
  const { aid } = req.params;
  const aaid = parseInt(aid);
  const article = await prisma.article.findUnique({
    where: { id: aaid },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
    },
  });
  res.status(200).json(product);
});
//////////////////////////////////////////////////////////////성공

router.post("/", async (req, res) => {
    const article = await prisma.article.create({
        data: req.body
    });

    res.status(201).json(article);
});

//////////////////////////////////////////////////////////////

router.patch("/:aid", async (req, res) => {
    const {aid} = req.params;
    const aaid = parseInt(aid)
    const updateDaTa = req.body;
    const article = await prisma.article.update({
        where: {id: aaid},
        data: updateDaTa,
    });

    res.status(200).json(article);
});

//////////////////////////////////////////////////////////////

    router.delete('/:aid', async  (req, res)=>{
    try{
        const {aid} =req.params;
        const aaid = parseInt(aid);
        await prisma.article.delete({
            where: {id: aaid},
        });
        res.sendStatus(204)
    } catch(error){
        res.json({ message: error.message })
    }
});




///////////////////////////////////////////////////////////

    // - 댓글 등록 API를 만들어 주세요.
    // - `content`를 입력하여 댓글을 등록합니다.
    // - 중고마켓, 자유게시판 댓글 등록 API를 따로 만들어 주세요.


router.post('/:aid/comments', async (req, res) => {
  const { aid } = req.params;
    const aaid = parseInt(aid);
    const { content } = req.body;
  const comment = await prisma.comment.create({
    data: {
      articleId: aaid, 
      content, 
    }
  });
  res.status(201).json(comment);
  });



  /////////////////////////////////////////////////////////

// - 댓글 목록 조회 API를 만들어 주세요.
//     - `id`, `content`, `createdAt` 를 조회합니다.
//     - cursor 방식의 페이지네이션 기능을 포함해 주세요.
//     - 중고마켓, 자유게시판 댓글 목록 조회 API를 따로 만들어 주세요.

router.get('/:aid/comments', async (req, res) => {
  const { aid } = req.params;
  const { limit = 5, cursor } = req.query;
  const aaid = parseInt(aid);
  const comments = await prisma.comment.findMany({
    where: { articleId: aaid },
    orderBy: {createdAt: "desc"},
    select: {
      id: true,
      content: true,
      createdAt: true,
    },
    take: parseInt(limit),
    ...(cursor && { cursor: { id: parseInt(cursor) }, skip: 1 }),
  });
  const nextCursor =
    comments.length === parseInt(limit)
      ? comments[comments.length - 1].id // 마지막 댓글의 ID를 다음 커서로 설정
      : null; 
  res.status(200).json({ comments, nextCursor });
});

export default router;
