import express from 'express'
import { PrismaClient } from '@prisma/client'
import { createArticle, patchArticle } from '.../validate.js' 

const prisma = new PrismaClient 

const app = express()
app.use(express.json())

const articleRouter = express.Router()


articleRouter.route('/') 
    // 1. 게시글 등록 API (title, content를 입력해 게시글을 등록)
    .post(async(req, res) => {
        try{  
            const newArticleData = createArticle.parse(req.body) 

            const article = await prisma.article.create({
                data: newArticleData
            })
            res.status(201).json(article) 
        }catch (error) { 
            if(error instanceof z.ZodError) { 
                res.status(400).json ({ error: error.errors}) 
            } else { 
                res.status(500).json({ message: "서버 오류가 발생했습니다."})
            }
        }
    })

    // 2. 게시글 목록 조회 API 
    /*id, title, content, createdAt를 조회
    offset 방식의 페이지네이션 기능을 포함
    최신순(recent)으로 정렬
    title, content에 포함된 단어로 검색 가능 */
    .get(async(req, res) => {
        const { offset = 0, limit =10, order = 'recent', keyword = '' } = req.query
        let orderBy
        switch (order) {
            case 'old' :
                orderBy =  { createdAt : 'asc' }
                break
            case 'recent' :
                orderBy = { createdAt : 'desc' }
        }

        const where = keyword 
        ? {
            OR : [
                {title : { contains: keyword, mode: 'insensitive'}},
                {content: { contains: keyword, mode: 'insensitive'}}
            ]
        }
        : {}

        const articles = await prisma.article.findMany({
            where,
            orderBy,
            skip: parseInt(offset),
            take: parseInt(limit),
            select: {
                id: true,
                title: true,
                content: true,
                createdAt: true
            }
        })
        res.status(200).json(articles)
    })




articleRouter.route('/:id')
// 3.게시글 상세 조회 API (id, title, content, createdAt를 조회)
    .get(async(req, res) => {
        const { id } = req.params  
        const article = await prisma.article.findUnique({
            where :  {id}, 
            select: {
                title: true,
                content: true,
                createdAt: true 
            }
        })
        
        if(!article) { 
            return res.status(400).json({message:'게시글을 찾을 수 없습니다.'})
        }
        res.status(200).json(article)
    })

// 4. 게시글 수정 API를 만들어 주세요.
    .patch(async(req, res) => {
        const { id } = req.params
        try{ 
            const updateArticleData = patchArticle.parse(req.body)
        
            const article =  await prisma.article.update({
                where : {id},
                data: updateArticleData
            })
        res.status(200).json(article)
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({ errors: error.errors })
            } else {
                res.status(500).json({ message: '서버 오류가 발생했거나, 게시글을 찾을 수 없습니다.'})
            }
        }
    
    })

// 5. 게시글 삭제 API를 만들어 주세요.
    .delete(async(req, res) => {
            const { id } = req.params
            
            try{
                await prisma.article.delete({
                    where: { id },
                })
                res.Status(200).json({ message : "게시글이 삭제 되었습니다 "})
            } catch (error) {
                res.status(404).json({ message: '삭제할 게시글을 찾을 수 없습니다.'})
            }
        }) 

export default articleRouter