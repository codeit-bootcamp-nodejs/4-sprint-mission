import prisma from '../lib/prisma.js'

interface patchUserInput{
    userId:number,
    nickname:string,
    image:string
}

interface patchPasswordInput{
    userId:number,
    password:string
}



export default class userRepository{

    patchUser = async({userId,nickname,image}:patchUserInput) =>{
        const patchUser = await prisma.user.update({
            where:{id:userId},
            data:{nickname,image}
        })
        return patchUser
    }

    patchPassword = async({userId,password}:patchPasswordInput) =>{
        const patchUser = await prisma.user.update({
            where:{id:userId},
            data:{password}
        })
        return patchUser
    }

    getUserProduct = async(userId:number) =>{
        const user = prisma.user.findUnique({
                        where:{id: userId},
                        include:{product:true}
                    })
        return user
    }
    
}