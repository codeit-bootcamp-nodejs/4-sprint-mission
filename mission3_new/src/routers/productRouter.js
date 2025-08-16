import express from 'express';
import prisma from '../client/prismaClient.js';
import { assert } from 'superstruct';
import { CreateProduct, PatchProduct, CreateComment } from '../validators/structor.js';
import asyncHandler from '../middlewares/asyncHandler.js';

const router = express.Router();

router.post('/', asyncHandler(async (req, res) => {
    assert(req.body, CreateProduct);
    const product = await prisma.product.create({
      data: req.body,
    });
    res.status(201).json(product);
  }),
);
/////////////////////////////////////////////////////////
//  - offset 방식의 페이지네이션 기능을 포함해 주세요.(쿼리파라미터 offset=1 & lim)
// - 최신순(`recent`)으로 정렬할 수 있습니다.
//  - `name`, `description`에 포함된 단어로 검색할 수 있습니다.

router.get('/', asyncHandler(async (req, res) => {
    const { order = 'asc', page = 1, pageSize = 3, keyword = '' } = req.query;

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

    const product = await prisma.product.findMany({
      where: whereClause,
      orderBy: {
        createdAt: orderBy,
      },
      skip: parseInt((page - 1) * pageSize),
      take: parseInt(pageSize),

      select: {
        id: true,
        name: true,
        price: true,
        createdAt: true,
      },
    });
    res.status(200).json(product);
  }),
);

/////////////////////////////////////////////////////////
router.get(
  '/:pid',
  asyncHandler(async (req, res) => {
    const { pid } = req.params;
    const parseld = parseInt(pid);
    const product = await prisma.product.findUnique({
      where: { id: parseld },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        tags: true,
        createdAt: true,
      },
    });
    res.status(200).json(product);
  }),
);

/////////////////////////////////////////////////////////
router.patch('/:pid',asyncHandler(async (req, res) => {
  assert(req.body, PatchProduct);
    const { pid } = req.params;
    const ppid = parseInt(pid);
    const updateDaTa = req.body;
    const product = await prisma.product.update({
      where: { id: ppid },
      data: updateDaTa,
    });
    res.status(200).json(product);
  }),
);

/////////////////////////////////////////////////////////
router.delete(
  '/:pid',
  asyncHandler(async (req, res) => {
    const { pid } = req.params;
    const ppid = parseInt(pid);
    await prisma.product.delete({
      where: { id: ppid },
    });
    res.sendStatus(204);
  })
);

// - 댓글 등록 API를 만들어 주세요.
// - `content`를 입력하여 댓글을 등록합니다.
// - 중고마켓, 자유게시판 댓글 등록 API를 따로 만들어 주세요.

router.post(
  '/:pid/comments',
  asyncHandler(async (req, res) => {
    assert(req.body, CreateComment);
    const { pid } = req.params;
    const ppid = parseInt(pid);
    const { content } = req.body;
    const comment = await prisma.comment.create({
      data: {
        productId: ppid,
        content,
      },
    });
    res.status(201).json(comment);
  }),
);

/////////////////////////////////////////////////////////

// - 댓글 목록 조회 API를 만들어 주세요.
//     - `id`, `content`, `createdAt` 를 조회합니다.
//     - cursor 방식의 페이지네이션 기능을 포함해 주세요.
//     - 중고마켓, 자유게시판 댓글 목록 조회 API를 따로 만들어 주세요.

router.get(
  '/:pid/comments',
  asyncHandler(async (req, res) => {
    const { pid } = req.params;
    const { limit = 5, cursor } = req.query;
    const ppid = parseInt(pid);
    const comments = await prisma.comment.findMany({
      where: { productId: ppid },
      orderBy: { createdAt: 'desc' },
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
  }),
);

export default router;
