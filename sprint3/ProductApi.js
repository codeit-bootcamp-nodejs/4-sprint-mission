import express from 'express'
import prisma from '@prisma/client'

app = express()
ProductRouter = express.Router()

ProductRouter.get('/', (req,res) =>{
    const offset = req.query.offset;
});

ProductRouter.get('/:id', async (req,res) =>{
    const id = req.params.id;
    try{
        const Product = await prisma.product.findUnique({
            where:{id}
        });
        res.send(Product);
        console.log(`get product : ${Product}`);
    }catch(error){
        res.end("interner Server Error");
    }
    
})


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
        res.send(Product);
    }catch(error){
        res.send("interner Server Error");
    }
})