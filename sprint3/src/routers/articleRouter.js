import express from 'express';
import prisma from '../client/prismaClient.js';

const router = express.Router();

router.get("/", async(req, res) => {
    const articles = await prisma.article.findMany();
    res.status(200).json(articles);
});


router.post("/", async(req, res) => {
    const article =await prisma.article.create({
        data: req.body
    });
    res.status(201).json(article);
});


router.patch("/:articleId", async(req, res) => {
    const{articleId} = req.params;
    const parseId = parseInt(articleId)
    const updatedata = await prisma.article.update({
        where: {id: parseId},
        data: req.body
    });
    res.json(updatedata)
});

router.delete("/:articleId", async(req, res) => {
    const{articleId} = req.params;
    const parseId = parseInt(articleId)
    await prisma.article.delete({
        where: {id: parseId}
    });
    res.sendStatus(204)
});

export default router; //내보내는 곳