import prisma from '../lib/prisma.js'

import type {User} from '../controller/user-controller.js'


interface postInput{
    name: string,
    description: string,
    price: number,
    tags: string,
    userId: number
}

interface patchInput{
    id:number,
    name: string,
    description: string,
    price: number,
    tags: string,
}

interface getCommentInput{
    take:number,
    skip:number,
    commentId:number}

interface postCommentInput{
    commentContent:string,
    id:number,
    user:User}

export default class ProductRepository{
    getProductById = async(id:number) => {
        let product = await prisma.product.findUnique({
            where:{id},
            include: {comment:true}
        });
        return product
    }

    postProduct = async({name,description,price,tags,userId}:postInput) =>{
        const product = await prisma.product.create({
            data:{
                name,
                description,
                price,
                tags,
                user:{connect:{id: userId}}
        }});

        return product
    }

    patchProduct = async({id,name,description,price,tags}:patchInput) =>{
        const product= await prisma.product.update({
            where: {id},
            data: {
                name,
                description,
                price,
                tags
        }});

        return product
    }

    deleteProduct = async(id:number) =>{
        await prisma.product.delete({
                        where:{id}
        });
    }

    getComments = async({take,skip,commentId}:getCommentInput) =>{
        const comments= await prisma.productComment.findMany({
            take,
            skip,
            cursor: {id: commentId},
            orderBy:{id: 'asc'}
        });
        return comments
    }

    postComment = async({commentContent,id,user}:postCommentInput) =>{
        const newComment = await prisma.productComment.create({
            data: {
                commentContent,
                product:{connect:{id}},
                user:{connect: {id: user.id}}
            }
        });

        return newComment
    }

    patchComment = async({commentContent,id,user}:postCommentInput) =>{
        const newComment = await prisma.productComment.create({
            data: {
                commentContent,
                product:{connect:{id}},
                user:{connect: {id: user.id}}
            }
        });

        return newComment
    }

    deleteComment = async(commentId: number) => {
        await prisma.productComment.delete({
                        where:{id:commentId}
                    });
    }
}