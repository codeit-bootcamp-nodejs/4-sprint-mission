import { PrismaClient } from '@prisma/client';
import express from 'express';

const router = express.Router();

const prisma = new PrismaClient();

router.post('/products/:productId/comments' ,  async (req, res) => {
    const { content } = req.body;
    const productId = Number(req.params.productId);

    if (!content) {
        return res.status(400).json({ error : '내용이 비어있습니디.'})
    }

    try {
        const comment = await prisma.comment.create({
            data : {
                content,
                productId,
            },
        });
        res.status(201).json(comment);
    }catch(error) {
        res.status(500).json({ error : '댓글 등록에 실패하였습니다.'})
    }
})

router.post('/articles/:articleId/comments' , async (req , res) =>{
    const { content } = req.body;
    const articleId = Number(req.params.articleId);

    if(!content) {
        return res.status(400).json({error : '내용이 비어있습니다.'})
    }

    try {
        const comment = await prisma.comment.create({
            data : {
                content,
                articleId
            }
        })
        res.status(500).json({ error : '댓글 등록에 실패했습니다. '})
    }catch(error) {
        res.status(500).json({ error : '댓글 등록에 실패했습니다. '})
    }
})

router.patch('/comments/:id' , async (req, res) => {
    const { content } = req.body
    const id = Number(req.params.id)

    if(!content) {
        return res.status(500).json({ error : `내용이 비어있습니다. `})
    }

    try {
        const updated = await prisma.comment.updated({
            where : { id },
            data : { content } 
        })
        res.json(updated)
    } catch(error) {
        res.status(404).json({erro : '댓글을 찾을 수 없습니다. '})
    }
})

router.delete('/comments/:id' , async (req, res) => {
    const id = Number(req.params.id)

    try {
        await prisma.comment.delete({
            where : { id }
        })
        res.status(204).send()
    }catch(error) {

        res.status(404).json({ error : '댓글을 찾을 수 없습니다.'})
    }
})

router.get('/products/:productId/comments', async (req, res) => {
    const productId = Number(req.params.productId)
    const { cursor, limit = 10} = req.query

    try{
        const comments = await prisma.comment.findMany({
            where : { productId },
            orderBy: { id: 'asc' },
            take: Number(limit),
            ...(cursor && {
                skip: 1,
                cursor: { id: Number(cursor) },
            }),
            select: {
                id: true,
                content: true,
                createdAt: true,
            },
            });

            res.json({ data : comments })
    }catch(error) {
        res.status(500).json({ error: '댓글을 불러오지 못했습니다.' });
    }
})

router.get('/articles/:articleId/comments', async (req, res) => {
  const articleId = Number(req.params.articleId);
  const { cursor, limit = 10 } = req.query;

  try {
    const comments = await prisma.comment.findMany({
      where: { articleId },
      orderBy: { id: 'asc' },
      take: Number(limit),
      ...(cursor && {
        skip: 1,
        cursor: { id: Number(cursor) },
      }),
      select: {
        id: true,
        content: true,
        createdAt: true,
      },
    });

    res.json({ data: comments });
  } catch (e) {
    res.status(500).json({ error: '댓글을 불러오지 못했습니다.' });
  }
});

export default router;