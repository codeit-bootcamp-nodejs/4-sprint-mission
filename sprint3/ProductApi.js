import express from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

const app = express()
const ProductRouter = express.Router()

// have to sort, pagination , validating, console.log

ProductRouter.get('/', async (req,res) =>{
    try{
        const {sort = 'recent', skip = 40, take= 10, searchName, searchDescription} = req.query;
        let orderBy ;

        if (sort === oldest){        
            orderBy = {createdAt : 'desc'};
        }else if (sort == recent){
            orderBy = {createdAt : 'asc'};
        }else{
            throw Error;
        }

        if (typeof(skip) != 'number' ||typeof(take) != 'number'){
            throw Error;
        }

    }catch(error){
        console.log("get product failed because of input type ")
        res.status(400).send("400 bad request")
    }


    try{
        const {name, description} = req.query;
        const Product = await prisma.product.findMany({
            // include: {
            //     comment: true
            // },
            skip,
            take,
            where: {
                AND:[
                    searchName? {name: {contains : searchName}} : {},
                    searchDescription? {content: {contains : searchDescription}} : {}
                ]
                
            }
        });
        console.log(`get product : ${Product.length}`);
        res.status(200).send(Product);
        
    }catch(error){
        console.log('get product failed because of server error');
        res.status(500).send("interner Server Error");
        
    }
});

ProductRouter.get('/:id', async (req,res) =>{
    const id = req.params.id;
    try{
        const Product = await prisma.product.findUnique({
            where:{id},
            include: {
                comment:true
            }
        });

        console.log(`get product : ${Product}`);
        res.status(200).send(Product);
        
    }catch(error){
        console.log('get product failed because of server error');
        res.status(500).end("interner Server Error");
    }
    
});


ProductRouter.post('/', async (req,res) =>{
    const {name,description, price, tags} = req.body;
    try{
        if (typeof(name) =='undefined' || typeof(description) =='undefined'||
            typeof(price) == 'undefined' || typeof(tags)=='undefined'){
                throw Error
            }
    } catch(error){
        res.status(400).send("required input is missing");
    }



    try{
        const Product = await prisma.product.create({
            data:{
                name,
                description,
                price,
                tags,
            }
        });
        console.log("post success");
        res.status(201).send(Product);
        
    }catch(error){
        console.log('post product failed because of server error');
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
        });
        console.log("patch success");
        res.status(201).send(product);
        
    }catch(error){
        console.log('patch product failed because of server error');
        res.status(500).send("server error");
    }
});

ProductRouter.delete('/:id', async (req,res) =>{
    const id = req.params.id ;

    try{
        prisma.product.delete({
            where:{id}
        });
        console.log("deleting success");
        res.status(200).send("deleting successed");
        
    }catch(error){
        console.log('deleting product failed because of server error');
        res.status(500).send("server error");
    }
});

export default ProductRouter;