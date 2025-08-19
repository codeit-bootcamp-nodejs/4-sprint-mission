import express from 'express';
import prisma from '../client/prismaClient.js';

const router = express.Router();

router.get("/", async (req, res) => {
    const products = await prisma.product.findMany({});
    res.json(products);
});


router.get("/:productId", async (req, res) => {
    const { productId } = req.params;
    const parseId = parseInt(productId);
    const product = await prisma.product.findUnique({
        where: {id: parseId},
    });
    res.status(200).json(product);
});

router.post("/", async (req, res) => {
    const product = await prisma.product.create({
        data: req.body
    })
    res.status(201).json(product);
});

router.patch("/:productId", async(req, res) => {

    const { productId } = req.params;
    const parseId = parseInt(productId) 
    const updateData = await prisma.product.update({
        where: {id: parseId},
        data: req.body
    });
    res.json(updateData);
});


router.delete("/:productId", async(req, res) => {
    const { productId} = req.params;
    const parseId = parseInt(productId)
    await prisma.product.delete({
        where: {id: parseId},
    });
    res.sendStatus(204);
}); 



export default router; //export가 내보내서 다른데 쓸 수 있게