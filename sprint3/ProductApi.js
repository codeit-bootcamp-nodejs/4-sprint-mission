import express from 'express'
import prisma from '@prisma/client'

app = express()
ProductRouter = express.Router()

ProductRouter.get('/', (req,res) =>{

    // have to 
    const {offset, sort, name, description} = req.query;
    try{
        const Product = await prisma.product.findMany({
            where:{
                name,
                description
            }
        });

        res.send(Product);
        console.log(`get product : ${Product.length}`);
    }catch(error){
        res.end("interner Server Error");
    }
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
        res.send(Product);
    }catch(error){
        res.send("interner Server Error");
    }
});

ProductRouter.patch('/:id', async (req,res) =>{
    const {name, description, price, tags} = req.body;
    const id = req.params.id ;

    prisma.product.update({
        where: {id},
        data: {
            
        }
    })
});

ProductRouter.delete('/:id', async (req,res) =>{

});
