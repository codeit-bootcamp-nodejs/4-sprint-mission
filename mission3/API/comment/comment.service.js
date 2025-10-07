import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

export const findUniqueCommentId = async(id) =>{
    return prisma.comment.findUnique({id});
}

