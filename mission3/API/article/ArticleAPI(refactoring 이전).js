/*import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router(); 
const prisma = new PrismaClient();


// access list of posts API
router.get('/', async (req, res) => {
    
    const { sort, page } = req.query;

    const pageNumber = Number(page) || 1;
    const take = 10;
    const skip = (pageNumber - 1) * take;


    // prunning 
    if (skip < 0){// chech whether skip number is positive
        return res.status(404).json({error: "the skip number cannot be negative number"});
    }
    if(sort !== "latest" ){ // if sorting is not recent
        return res.status(400).json({error:"error for sorting"});
    }

    try {
        const articlesList = await prisma.article.findMany({
            orderBy : {
                createdAt:"desc"
            },
            skip,
            take
        });

        res.status(200).json({
            message : "success for accessing list", data: articlesList
        });

    } catch (error) {
        console.error(error);
        res.status(500).json(error.message);
    }   
    
});

// access post of id and content, created at
router.get('/:id', async (req, res) => {
    const id = Number(req.params.id);
    
    console.log("Get request arrived:", req.params)
    console.log( typeof id)

    if (isNaN(id)) return res.status(400).json({ error: "invalid post id" });

    try {
        const uniquePost = await prisma.article.findUnique({
            where:{id},
        });

        res.status(200).json({
            message: "success for find unique post",
            data: uniquePost    
        });

    } catch (error) {
        console.error(error);
        res.status(500).json(error.message);
    }
})

// register post Api
router.post('/', async(req, res) =>{ // inserting title content in post
    const { title,  content } = req.body;

    // prunning 
    if( !title || !content ) return res.status(400).json({error: "error for post"});

    console.log(" requesting POST : ", req.body)// debugging
    
    try{
        const newPost = await prisma.article.create({
            data :{
                title, 
                content,
            },
        });
        res.status(201).json(newPost);
        console.log("POST reqeusted :",newPost);

    }catch(error){
        console.error(error);
        res.status(500).json({error: "post error in server"});
    }
});

//filtering unique index or not
const getUniqueArticleId = async (id) => {
   return prisma.article.findUnique({where:{id}})
}

// modify post API by update
router.patch('/:id', async (req, res) => {
    const  id = Number(req.params.id);
    const {title,  content, createdAt }= req.body;
    const updatedPostId = await getUniqueArticleId(id); 
    
    if(!updatedPostId) return res.status(400).json("please check article index"); // if the item is not in posts, cannnot update the post.

    if(!title || !content) {
        return res.status(400).json({error : "please check your article components"});
    }
    console.log("updating post:", req.body);

    try{
        const updatedPost = await prisma.article.update({
        where: { id }, //index for updating / modifying
        data : { // componnents for modifying 
            title, 
            content,
            }
        });
        console.log("success updating data:" ,updatedPost);
        res.status(200).json({message : "success Modify", data: updatedPost});

    }catch(error){
        console.error("error for updating post");
        res.status(400).json({error: "server error for updating post"});
    }  
})

// remove post API
router.delete('/:id', async (req, res) => {
    const id = Number(req.params.id);
    const uniqueArticleId= await getUniqueArticleId(id);

    if(!uniqueArticleId){
        return res.status(400).json({error: "there is no Article"});
    }

    // check whether communication success or not
    try {
        await prisma.article.delete({where: {id}}); // remove item which is located in the index place
        res.status(200).json({message :"success for deleting post"}) ;  
    } catch (error) {
        console.error(error);
        res.status(500).json(error.message);
    }
});
export default router;
*/