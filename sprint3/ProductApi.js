import express from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

const app = express()
const ProductRouter = express.Router()

// have to sort, pagination, add status code, validating, console.log

ProductRouter.get('/', async (req,res) =>{

    
    const {offset, sort, name, description} = req.query;
    try{
        const Product = await prisma.product.findMany({
            where:{
                name,
                description
            }
        });

        res.status(200).send(Product);
        console.log(`get product : ${Product.length}`);
    }catch(error){
        res.status(500).send("interner Server Error");
    }
});

ProductRouter.get('/:id', async (req,res) =>{
    const id = req.params.id;
    try{
        const Product = await prisma.product.findUnique({
            where:{id}
        });
        res.status(200).send(Product);
        console.log(`get product : ${Product}`);
    }catch(error){
        res.status(500).end("interner Server Error");
    }
    
});


ProductRouter.post('/', async (req,res) =>{
    const {name,description, price, tags} = req.body;

    try{
        const Product = await prisma.product.create({
            data:{
                name,
                description,
                price,
                tags,
            }
        });
        res.status(201).send(Product);
        console.log("post success");
    }catch(error){
        res.status(500).send("interner Server Error");
    }
});

ProductRouter.patch('/:id', async (req,res) =>{
    const {name, description, price, tags} = req.body;
    const id = req.params.id ;

    try{
        const product= prisma.product.update({
            where: {id},
            data: {
                name,
                description,
                price,
                tags
            }
        })
        res.status(201).send(product);
        console.log("patch success");
    }catch(error){
        res.status(500).send("server error");
    }
});

ProductRouter.delete('/:id', async (req,res) =>{
    const id = req.params.id ;

    try{
        prisma.product.delete({
            where:{id}
        });
        res.status(200).send("deleting successed");
        console.log("deleting success");
    }catch(error){
        res.status(500).send("server error");
    }
});

export default ProductRouter;