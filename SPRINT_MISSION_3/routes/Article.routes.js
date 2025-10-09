import express from 'express';
import { PrismaClient } from '@prisma/client';;

const router = express.Router();
const prisma = new PrismaClient();

router.post('/article', async(req, res) => {
    const { title , article } = req.body;

    if(!title || !article) {
        return res.status(400).json({ error: '모든 필드를 정확히 입력해주세요.' });
    }

    try {
        const article = await prisma.article.create({
            data : {title , article}
        })
    }catch(error) {
        console.error(`게시글 등록 오류 : ${error}`)
        res.status(500).json({error : '게시글 등록 중 오류가 발생하였습니다.'})
    }
})

router.get('/article/:id', async(req, res) => {
    const id = Number(req.params.id);

    if(isNaN(id)){
        return res.status(400).json({ error : "올바른 게시판 ID를 입력히세요"})
    }

    try{
        const article = await prisma.article.findUniqueOrThrow({
            where : {id},
            select : {
                id : true,
                title : true,
                article : true,
                createdAt : true,
            }
        })

        res.status(200).json(article)
    }catch(error) {
        console.error(error)
        res.status(404).json({ error: '해당 게시글을 찾을 수 없습니다.' });
    }
})

router.patch('/article/:id' , async(req, res) => {
    const id = Number(req.params.id);
    const { title , article } = req.body

    if(isNaN(id)) {
        return res.status(500).json({error : '올바른 게시글 ID를 입력하세요. '})
    }

    try {
        const updated = await prisma.article.updated({
            where : { id },
            data : (title , article)
        });

        res.status(200).json(updated)
    }catch(error) {
        console.error(error)
        res.status(404).json({ error : '게시글을 찾을 수 없습니다.'})
    }
});

router.delete('/article/:id' , async(req , res) => {
    const id = Number(req.params.id)

    if(isNaN(id)) {
        return res.status(400).json({ error : '올바른 게시글 ID를 입력해주세요'})
    }

    try {
        await prisma.article.delete({ where : id});
    }catch(error) {
        console.error(error)
        res.status(404).json({error : '게시글을 찾을 수 없습니다.'})
    }
})

router.get('/article' , async(req , res) => {
    const {
        page = 1,
        limit = 1,
        search = '',
        sort = 'recent',
    } = req.query;

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  try {
    const article = await prisma.article.findMany({
        where: {
            OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { article: { contains: search, mode: 'insensitive' } },
            ],
        },
        orderBy : sort === 'recent' ? { createdAt : 'desc'} : undefined,
        skip,
        take,
        select : {
            id : true,
            title : true,
            article : true,
            createdAt : true
        } 
    })

    const totalCount = await prisma.article.count({
        where : {
            OR : [
                { title : { contains : search , mode : 'insensitive'}},
                { article : { contains : search , mode : 'insensitive'}}
            ]
        }
    });

    res.json({
        data : article,
        meta : {
            total : totalCount,
            page : Number(page),
            limit : Number(limit),
            totalPages : Math.ceil(totalCount / limit),
        }
    });
  }catch(error) {
    res.status(500).json({ error: '게시글을 조회하는 중 오류가 발생했습니다.' });
  }
})

export default router;