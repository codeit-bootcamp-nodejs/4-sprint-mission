/*
import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';


dotenv.config();
const router = express.Router(); 
const prisma = new PrismaClient();

// accessing product list API

router.get('/', async (req, res) => {.
    // prunning
    //if (!id || !name || !price ) { // Required fields (id, name, price, createAt) are missing.
       // return res.status(400).json({error: "요청에 필요한 필드(id, name, price, createAt)가 누락되었습니다." }) // send error code
    //}
    const { sort, page } = req.query;

    const pageNumber = parseInt(page) || 1 // conver to integer
    const take = 10
    let skip = (pageNumber - 1) * take

    console.log('sort:', sort);

    // prunning
    if (skip < 0 ){ 
        return res.status(400).json({message: "skip number cannot be negative."})
    }
    
    if (sort !== "latest"){
        return res.status(404).send({error : "please check sort function"})
    } 
    
    //  sorting by prisma
    try{
        const items_list = await prisma.product.findMany({
            orderBy: { createdAt: "desc" },
            skip,
            take
        });

        console.log('가져온 아이템 리스트:', items_list);
        res.status(200).json({
            message : "서버에서 품목 리스트 가져오기 성공", 
            data : items_list
        })

    }catch(e){
        console.log(e);
        res.status(500).json({error : "failled access the list from the server"});
    }
})


/*router.get('/', async (req, res) => {
    try {
        const items = await prisma.product.findMany({ take: 10 });
        console.log('조회된 제품 목록:', items);
        res.status(200).json({ message: "목록 조회 성공", items });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "failed to get products" });
    }
});//

// Accessing product 

router.get('/:id', async (req, res) => {
    const id = Number(req.params.id);
    console.log("요청 받은 params:", req.params);
    
    try{
        const item = await prisma.product.findUnique({
            where:{ // find i-th product
                id
            }, 
            select:{
                name : true,// bring name data 
                description : true,
                price :true, 
                productTags : {
                    include:{
                        tag : true
                    }
                },
                createdAt: true
            }
        });
        if(!item){ // if bringged data value is false 
            return res.status(400).send("해당 아이템 없음")
        }
        res.status(200).json({
            message : "아이템 정보 조회 성공",
            data : item
        }); 
    }catch(e){
        console.error(e);
        res.status(500).json({error: "서버에서 아이템 가져오기 실패"})
        return ;
    }
    
})

// product register api
router.post('/', async (req, res) => {
    const { name, description, price, tags } = req.body;
    console.log('POST 요청 도착:', req.body);
    console.log("받은 태그:", tags);
    
    // prunning
    if( !name || !description || !price || !tags )return res.status(400).json({error: "게시글 등록 서버 문제"})
    if( typeof name !== "String") return res.status(400).json({error: "문자열이어야 합니다"});

    // creating the post from reqeust data.
    try{
        const newPost = await prisma.product.create({
            data:{// data that client requested
                name,
                description,
                price,
                productTags :{
                    //iterating tag array,handling the tags to connect or create
                    create : tags.map((tagName) =>({
                        tag:{
                            connectOrCreate:{
                                where : {name: tagName},
                                create :{name: tagName}
                            }
                        }
                    }))
                }
            },
            include: {
                productTags: true
            }
        });

        res.status(201).send({
            message: "게시글 생성 성공",
            data: newPost
        });

    }catch(e){
        console.error(e);
        res.status(500).json({error: "failed to post"})
    }   
});
// deleting product Api
router.delete("/:id", async (req, res) => {
    const id  =  Number(req.params.id);
    
    if (!id) return res.status(404).json({error:"삭제할 아이템이 없습니다."})

    try {
        await prisma.product.delete({
            where: {id}
        })

        res.status(200).json({
            message:"삭제 성공"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({error: "e from server"})
    }
    
})

// updating product API
router.patch("/:id", async (req, res) => {
    const  id  = req.params.id;
    const data = Number(req.body); 

    if (! id || !data) return res.status(404).json({error: "수정 실패"})// if there is no index or data
    
    try {
        const updatedData = { ...data};

        if (data.tags !== undefined){
            updatedData.productTag = {
                deleteMany : { },
                create: data.tags.map((tagId) => ({
                    tag:{connect:{id: tagId}}
                }))
                
            }
            delete updatedData.tags
        }

        const modifiedItem = await prisma.product.update({
            where:{ id },
            data :updatedData,
            include:{
                productTags:{
                    include:{
                        tag: true
                    }
                }
            }
        });

        res.status(201).json({ 
            message:"success modify",
            data: modifiedItem
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({error:"server problem to patch"})
   }
})

export default router;
*/